// Firebase configuration and initialization
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAhsxo_hANatHoesmDtXhrx8Vo5YIQx9-w",
  authDomain: "lumigram-562fb.firebaseapp.com",
  projectId: "lumigram-562fb",
  storageBucket: "lumigram-562fb.firebasestorage.app",
  messagingSenderId: "403314247311",
  appId: "1:403314247311:web:510b64269ed0658a2c52fa",
  measurementId: "G-YRKVW4R567"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore(app);

export { app, storage, db };