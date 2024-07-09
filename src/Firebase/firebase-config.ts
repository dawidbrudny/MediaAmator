//  App
import { initializeApp } from "firebase/app";

//  Firestore, Auth, Storage
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from 'firebase/storage';
import 'firebase/storage';

//  Admin SDK
import admin from 'firebase-admin';
import serviceAccount from './mediaamator-779dd-firebase-adminsdk-ulmqk-3dd8dfd358.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  storageBucket: "gs://mediaamator-779dd.appspot.com"
});

const storageAdmin: admin.storage.Storage = admin.storage();
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAvHmkodvHAk6EKExPPdAtP2LuAtb3HC3c",
  authDomain: "mediaamator-779dd.firebaseapp.com",
  projectId: "mediaamator-779dd",
  storageBucket: "mediaamator-779dd.appspot.com",
  messagingSenderId: "631001081841",
  appId: "1:631001081841:web:ded24787c575965aa08650",
  measurementId: "G-DQ4SPY64E7"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { db, auth, storage, storageAdmin };