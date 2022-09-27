import { FirebaseOptions, initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyCrdOr-Ont82y6UWDzUXFjJZiQ5aP7YKms",
  authDomain: "fair-ladder.firebaseapp.com",
  projectId: "fair-ladder",
  storageBucket: "fair-ladder.appspot.com",
  messagingSenderId: "275356606993",
  appId: "1:275356606993:web:f1318889a70133779ac7b0",
  databaseURL: "https://fair-ladder-default-rtdb.asia-southeast1.firebasedatabase.app",
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseDatabase = getDatabase(firebaseApp);
