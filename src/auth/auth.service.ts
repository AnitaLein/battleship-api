import { Injectable } from '@nestjs/common';
import { db } from '../firebase';
import * as bcrypt from 'bcryptjs';

export type LoginData = {
  username: string;
  password: string;
};

@Injectable()
export class AuthService {
  private credentialsCollection = db.collection('credentials');
  private playersCollection = db.collection('players');

  async createCredentials(username: string, password: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    const randomId = Math.floor(Math.random() * 1000000);
    await this.credentialsCollection.add({
      id: randomId,
      username: username,
      password: hashedPassword,
    });
  }

  async validUserId(id: string): Promise<boolean> {
    console.log(id);
    const snapshot = await this.playersCollection
      .where('userId', '==', id)
      .get();
    return !snapshot.empty;
  }

  async login(data: LoginData): Promise<{ id: string }> {
    console.log(data);
    const snapshot = await this.credentialsCollection.get();
    if (snapshot.empty) {
      throw new Error('No credentials found');
    }
    //find document with matching username
    const userDoc = snapshot.docs.find((doc) => {
      const docData = doc.data();
      if (docData.username === data.username) {
        return docData;
      }
    });
    if (!userDoc) {
      throw new Error('Invalid username or password');
    }
    const userData = userDoc.data();
    const isPasswordValid = await bcrypt.compare(
      data.password,
      userData.password,
    );
    if (!isPasswordValid) {
      throw new Error('Invalid username or password');
    }
    if (!userData.id) {
      throw new Error('User ID not found');
    }
    console.log(userData.id.toString());
    return userData.id.toString() ;
  }

  async checkTeamCreated(id: string): Promise<boolean> {
    const snapshot = await this.playersCollection
      .where('userId', '==', id)
      .limit(1)
      .get();

    if (snapshot.empty) {
      throw new Error('No players found');
    }
    const teams = snapshot.docs.map((doc) => {
      const data = doc.data();
      if (data.name == '') {
        return false;
      } else return true;
    });
    return teams[0];
  }
}
