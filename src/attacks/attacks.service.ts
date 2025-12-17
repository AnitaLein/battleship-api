import { Injectable } from '@nestjs/common';
import { db } from '../firebase';
import { Player, PlayerService } from 'src/player/player.service';

export type Attack = {
  id: string;
  userId: string;
  targetId: string;
  date: string;
  targetPos: string;
  isHit: boolean | null;
  sunk: boolean | null;
};

@Injectable()
export class AttacksService {
  private playerCollection = db.collection('players');
  private attacksCollection = db.collection('attacks');
  private readonly playerService: PlayerService;

  constructor(playerService: PlayerService) {
    this.playerService = playerService;
  }

  async attack(userId: string, targetName: string, targetField: string) {
    const today = new Date();
    const todayStr = today.getDate().toString().padStart(2, '0');
    // Check if this user has already attacked today
    const userAttacks = await this.attacksCollection
      .where('userId', '==', userId)
      .where('date', '==', todayStr)
      .get();

    const attackCount = userAttacks.size;
    if (attackCount > 2) {
      return {
        success: false,
        message:
          'Ihr habt heute schon zwei Mal angegriffen. Der Kampf geht morgen weiter!',
      };
    }

    // Find target player by name
    const targetUserSnapshot = await this.playerCollection
      .where('name', '==', targetName)
      .get();

    if (targetUserSnapshot.empty) {
      throw new Error(`No player found with name: ${targetName}`);
    }

    const targetDoc = targetUserSnapshot.docs[0];
    const targetData = targetDoc.data() as Player;

    // Check if the attack hits a boat
    let isHit = false;
    for (const boat of targetData.boats) {
      if (boat.positions.includes(targetField)) {
        isHit = true;
        break;
      }
    }
    let boatSunk = false;
    try {
      const res = await this.playerService.updatePlayerHitPosition(
        targetData.userId,
        targetField,
      );
      boatSunk = res.sunk ?? false;
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
    }
    const randomAttackId = Math.random().toString(36).substring(2, 15);
    const attackData: Attack = {
      id: randomAttackId,
      userId,
      targetId: targetData.userId,
      date: todayStr,
      targetPos: targetField,
      isHit,
      sunk: boatSunk,
    };
    await this.attacksCollection.add(attackData);

    return {
      id: randomAttackId,
      success: true,
      targetName: targetName,
      targetPos: targetField,
      isHit: isHit,
      isSunk: boatSunk,
    };
  }

  async getAllAttacks() {
    const snapshot = await this.attacksCollection.get();

    if (snapshot.empty) {
      throw new Error('Keine Angriffe gefunden');
    }

    const attacks: {
      id: string;
      userName: string;
      targetName: string;
      targetPos: string;
      date: string;
      isHit: boolean | null;
      isSunk: boolean | null;
    }[] = [];

    for (const doc of snapshot.docs) {
      const data = doc.data() as Attack;
      console.log(data);
      const date = data.date;
      const isHit = data.isHit;
      const isSunk = data.sunk;

      const userId = data.userId;
      const targetPos = data.targetPos;
      const targetId = data.targetId;
      // Fetch player docs sequentially (no Promise.all)
      // Fetch player docs sequentially using queries
      const userQuery = await this.playerCollection
        .where('userId', '==', userId)
        .limit(1)
        .get();

      const targetQuery = await this.playerCollection
        .where('userId', '==', targetId)
        .limit(1)
        .get();

      const userData = !userQuery.empty
        ? (userQuery.docs[0].data() as Player)
        : undefined;

      const targetData = !targetQuery.empty
        ? (targetQuery.docs[0].data() as Player)
        : undefined;

      const userName = userData?.name ?? 'Unknown';
      const targetName = targetData?.name ?? 'Unknown';
      attacks.push({
        id: data.id,
        userName,
        targetName,
        targetPos,
        date,
        isHit,
        isSunk,
      });
    }
    attacks.sort((a, b) => (a.date < b.date ? 1 : -1));
    return attacks;
  }
}
