// src/features/auth/services/authService.js
import { auth } from '../../../firebase/firebaseConfig';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
} from 'firebase/auth';

// Register dengan email/password
export const register = async (name, email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: name });
    return {
      uid: userCredential.user.uid,
      email: userCredential.user.email,
      name: userCredential.user.displayName,
      profilePicture: userCredential.user.photoURL || null,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Login dengan email/password
export const login = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    return {
      uid: user.uid,
      email: user.email,
      name: user.displayName,
      profilePicture: user.photoURL || null,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Login dengan Google
export const signInWithGoogle = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, provider);
    const user = userCredential.user;
    return {
      uid: user.uid,
      email: user.email,
      name: user.displayName,
      profilePicture: user.photoURL || null,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

// Logout
export const logout = async () => {
  await signOut(auth);
  return true;
};
