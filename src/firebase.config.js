import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCSS-ZbtFYEVPZocVlubknCLEkVdzU16B8",
  authDomain: "sari-site.firebaseapp.com",
  projectId: "sari-site",
  storageBucket: "sari-site.appspot.com",
  messagingSenderId: "548990668916",
  appId: "1:548990668916:web:7744243b2149f50af10121"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore()