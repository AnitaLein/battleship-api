import { Injectable } from '@nestjs/common';
import { db } from '../firebase';
import bcrypt from 'node_modules/bcryptjs';

export type LoginData = {
  username: string;
  password: string;
};

@Injectable()
export class AuthService {
  private credentialsCollection = db.collection('credentials');

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
    const snapshot = await this.credentialsCollection.get();

    if (snapshot.empty) {
      throw new Error('No credentials found');
    }

    // Find any document where data.id matches the input id
    const userDoc = snapshot.docs.find((doc) => {
      const data = doc.data();
      return data.id?.toString() === id;
    });

    if (userDoc) {
      return true;
    } else {
      // Optional: throw if you want, or just return false
      console.log('User ID not found');
      return false;
    }
  }

  async login(data: LoginData): Promise<string> {
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
    return userData.id.toString();
  }
}
