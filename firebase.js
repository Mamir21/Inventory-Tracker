import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB1fd0If3xF82zv4UR7smcafnwvOfV0CYQ",
  authDomain: "inventory-tracker-863f6.firebaseapp.com",
  projectId: "inventory-tracker-863f6",
  storageBucket: "inventory-tracker-863f6.appspot.com",
  messagingSenderId: "972157447883",
  appId: "1:972157447883:web:f47caa4092aaeab78c754e"
}

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore}