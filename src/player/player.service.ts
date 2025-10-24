import { Injectable } from '@nestjs/common';
import { db } from '../firebase';

export type Boats = {
  id: string;
  size: number;
  positions: string[];
};

export type Attack = {
  attackerId: string;
  defenderId: string;
  position: string;
  isHit: boolean | null;
};

export type Player = {
  userId: string;
  name: string;
  boats: Boats[] | [];
  Attacks: Attack[] | [];
};

@Injectable()
export class PlayerService {
  private playerCollection = db.collection('players');

  async createPlayer(userId: string, name: string) {
    const player: Player = {
      userId,
      name,
      boats: [],
      Attacks: [],
    };
    await this.playerCollection.doc(userId).set(player);
  }

  async getAllPlayers(userId: string): Promise<Player[]> {
    const snapshot = await this.playerCollection
      .where('userId', '!=', userId)
      .get();
    if (snapshot.empty) {
      throw new Error('No players found');
    }
    const players: Player[] = [];
    snapshot.forEach((doc) => {
      players.push(doc.data() as Player);
    });
    return players;
  }
}
