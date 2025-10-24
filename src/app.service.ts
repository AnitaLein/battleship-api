import { Injectable } from '@nestjs/common';
import { db } from './firebase';

export type Boat = {
  id: number;
  length: number;
  positions: string[];
};

export type Attack = {
  AttackerId: number;
  DefenderId: number;
  Position: string;
  IsHit: boolean;
};

export type Player = {
  id: number;
  name: string;
  boats: Boat[];
  attacks: Attack[];
};

@Injectable()
export class AppService {
  private playersCollection = db.collection('players');
  private attacksCollection = db.collection('attacks');

  // Get all players
  async getPlayers(): Promise<Player[]> {
    const snapshot = await this.playersCollection.get();
    return snapshot.docs.map((doc) => doc.data() as Player);
  }

  // Get one player by ID
  async getPlayer(id: string): Promise<Player | null> {
    const doc = await this.playersCollection.doc(id).get();
    return doc.exists ? (doc.data() as Player) : null;
  }

  // Add an attack
  async addAttack(attack: Attack) {
    const newDoc = await this.attacksCollection.add(attack);
    return { id: newDoc.id, ...attack };
  }

  // Get all attacks
  async getAttacks(): Promise<Attack[]> {
    const snapshot = await this.attacksCollection.get();
    return snapshot.docs.map((doc) => doc.data() as Attack);
  }
}
