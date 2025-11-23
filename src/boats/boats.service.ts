import { Injectable } from '@nestjs/common';
import { db } from '../firebase';

export type Boats = {
  size: number;
  positions: string[];
  sunk?: boolean;
};

@Injectable()
export class BoatsService {
  private playerCollection = db.collection('players');

  async addBoats(userId: string, boats: Boats[]) {
    // Find player by userId
    const playerSnapshot = await this.playerCollection
      .where('userId', '==', userId)
      .get();

    if (playerSnapshot.empty) {
      throw new Error('Player not found');
    }

    const playerDoc = playerSnapshot.docs[0];
    const playerRef = playerDoc.ref;

    // Update or set boats
    await playerRef.update({ boats });

    return {
      message: 'Boats successfully added',
      boats,
    };
  }
}
