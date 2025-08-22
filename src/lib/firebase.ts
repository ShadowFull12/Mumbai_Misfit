// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  projectId: 'mumbai-misfit',
  appId: '1:936583707232:web:43dba130e4c30471ad2105',
  storageBucket: 'mumbai-misfit.firebasestorage.app',
  apiKey: 'AIzaSyBe47Pw6mH8Lu2p0KZQBNGZ2C3o6mbA7-o',
  authDomain: 'mumbai-misfit.firebaseapp.com',
  messagingSenderId: '936583707232',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { app, firestore };
