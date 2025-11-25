import { NotFoundException } from '@nestjs/common';
import { bucket, db, admin } from '../firebase';

export class ImagesService {
  private usersCollection = db.collection('users');
  private attackImagesCollection = db.collection('attackImages');

  async uploadProfilePicture(userId: string, base64Image: string) {
    if (!userId || !base64Image) {
      throw new Error('Missing userId or image');
    }
    console.log('in function');
    // Convert Base64 string to buffer
    const buffer = Buffer.from(base64Image, 'base64');

    // File path in the bucket
    const filePath = `profilePictures/${userId}.jpg`;
    const file = bucket.file(filePath);

    // Upload buffer to bucket
    const save = await file.save(buffer, {
      metadata: {
        contentType: 'image/jpeg',
        cacheControl: 'public,max-age=31536000',
      },
      resumable: false,
      validation: 'md5',
    });

    console.log(save);

    // Generate a public signed URL
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: '2030-03-01',
    });

    // Save URL + timestamp in Firestore
    await this.usersCollection.doc(userId).set(
      {
        profilePic: url,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    return url;
  }

  async getProfilePictureUrl(userId: string) {
    const file = bucket.file(`profilePictures/${userId}.jpg`);

    const [exists] = await file.exists();
    if (!exists) throw new NotFoundException('Profile picture not found');

    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: '2030-03-01',
    });
    console.log(url);
    return url;
  }

  async uploadAttackPicture(attackId: string, base64Image: string) {
    if (!attackId || !base64Image) {
      throw new Error('Missing attackId or image');
    }

    // Convert Base64 string to buffer
    const buffer = Buffer.from(base64Image, 'base64');

    // File path in the bucket
    const filePath = `attackPictures/${attackId}.jpg`;
    const file = bucket.file(filePath);

    // Upload buffer to bucket
    await file.save(buffer, {
      metadata: {
        contentType: 'image/jpeg',
        cacheControl: 'public,max-age=31536000',
      },
      resumable: false,
      validation: 'md5',
    });

    // Generate a public signed URL
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: '2030-03-01',
    });

    await this.attackImagesCollection.doc(attackId).set(
      {
        imageUrl: url,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true },
    );

    return url;
  }

  async getAttackPictureUrl(attackId: string) {
    const file = bucket.file(`attackPictures/${attackId}.jpg`);
    const [url] = await file.getSignedUrl({
      action: 'read',
      expires: '2030-03-01',
    });
    return url;
  }
}
