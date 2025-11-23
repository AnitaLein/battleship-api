import { Injectable } from '@nestjs/common';
import { db } from '../firebase';
import { Boats } from 'src/boats/boats.service';

export type Player = {
  userId: string;
  name: string;
  boats: Boats[];
  attackedPos: string[];
};

@Injectable()
export class PlayerService {
  private playerCollection = db.collection('players');

  async createPlayer(id: string, name: string) {
    // Query the players collection for an existing player with this userId
    const snapshot = await this.playerCollection
      .where('userId', '==', id)
      .get();

    // If we found existing documents, update their name
    if (!snapshot.empty) {
      const updates = snapshot.docs.map((d) =>
        this.playerCollection.doc(d.id).update({ name }),
      );
      await Promise.all(updates);
      return { updated: snapshot.size };
    }

    // Otherwise create a new player document
    const newDocRef = this.playerCollection.doc();
    await newDocRef.set({
      userId: id,
      name,
      boats: [],
    });
    return { id: newDocRef.id };
  }

  async initPlayer() {
    const randomUserID =
      'user_' +
      Date.now().toString(36) +
      '_' +
      Math.random().toString(36).substring(2, 10);

    const body = {
      name: '',
      userId: randomUserID,
      boats: [],
      attackedPos: [],
    };

    await this.playerCollection.add(body);

    return body;
  }

  async updatePlayerName(id: string, name: string) {
    // Query the players collection for documents matching this userId
    console.log('Updating player name for userId:', id, 'to:', name);

    // make absolutely sure the id is a string
    const userId = String(id).trim();

    // log everything to verify
    const allPlayers = await this.playerCollection.get();
    allPlayers.forEach((doc) => console.log(doc.id, doc.data()));

    const snapshot = await this.playerCollection
      .where('userId', '==', userId)
      .get();

    console.log('snapshot.empty:', snapshot.empty);

    if (snapshot.empty) {
      throw new Error(`No players found for userId: ${userId}`);
    }

    const updatePromises = snapshot.docs.map(async (doc) => {
      await doc.ref.update({ name });
      console.log(`Updated doc ${doc.id} with new name: ${name}`);
      return { id: doc.id, ...doc.data(), name };
    });

    const updatedPlayers = await Promise.all(updatePromises);
    return updatedPlayers;
  }

  async updatePlayerHitPosition(userId: string, hitPosition: string) {
    const snapshot = await this.playerCollection
      .where('userId', '==', userId)
      .get();
    if (snapshot.empty) {
      throw new Error(`No players found for userId: ${userId}`);
    }
    const doc = snapshot.docs[0];
    const playerData = doc.data() as Player;
    // Update boats to mark the hit position
    if (playerData.attackedPos.includes(hitPosition)) {
      throw new Error(
        `Position ${hitPosition} wurde bereits angegriffen. Wähle ein anderes Feld.`,
      );
    }
    playerData.attackedPos.push(hitPosition);
    // check if any boat sunk and update boats array accordingly
    let boatSunk = false;
    for (const boat of playerData.boats) {
      const isSunk = boat.positions.every((pos) =>
        playerData.attackedPos.includes(pos),
      );
      if (isSunk && !(boat as any).sunk) {
        // mark boat as sunk in local object
        (boat as any).sunk = true;
        boatSunk = true;
      }
    }
    console.log('boatSunk:', boatSunk);

    // persist changes to attacked positions and boats
    await doc.ref.update({
      attackedPos: playerData.attackedPos,
      boats: playerData.boats,
    });

    return {
      success: true,
      id: doc.id,
      ...playerData,
      sunk: boatSunk,
    };
  }

  async getAllPlayers(userId: string): Promise<string[]> {
    const snapshot = await this.playerCollection
      .where('userId', '!=', userId)
      .get();
    if (snapshot.empty) {
      throw new Error('No players found');
    }
    const players: string[] = [];
    snapshot.forEach((doc) => {
      const docData = doc.data();
      players.push(docData.name);
    });
    console.log(players);
    return players;
  }
}
