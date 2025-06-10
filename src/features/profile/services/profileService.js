import { db } from '../../../firebase/firebaseConfig';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { app } from '../../../firebase/firebaseConfig'; // Pastikan ini sudah ada dan benar

const storage = getStorage(app);

// Upload gambar base64 ke Firebase Storage dan kembalikan URL download-nya
export const uploadProfilePicture = async (userId, base64Image) => {
  try {
    const storageRef = ref(storage, `profilePictures/${userId}.jpg`);
    await uploadString(storageRef, base64Image, 'data_url');
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    throw new Error(error.message || 'Failed to upload profile picture');
  }
};

// Update profil user di Firestore, menerima URL gambar
export const updateProfile = async (userId, profileData) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);

    const updateData = {
      name: profileData.name,
      email: profileData.email,
      about: profileData.about || '',
      profilePicture: profileData.profilePicture || null, // harus URL
      updatedAt: new Date(),
    };

    if (userDocSnap.exists()) {
      await updateDoc(userDocRef, updateData);
    } else {
      await setDoc(userDocRef, {
        ...updateData,
        createdAt: new Date(),
      });
    }

    return { id: userId, ...updateData };
  } catch (error) {
    throw new Error(error.message || 'Failed to update profile in database');
  }
};
