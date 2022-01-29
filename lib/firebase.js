import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import {
  getFirestore,
  limit,
  query,
  collection,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAP2SZh_1ZRdx6nQ2gBBrqA5NGJreXvfQo",
  authDomain: "next-app-25945.firebaseapp.com",
  projectId: "next-app-25945",
  storageBucket: "next-app-25945.appspot.com",
  messagingSenderId: "762550279812",
  appId: "1:762550279812:web:8bd067a4a31c735945ecd1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const db = getFirestore();
export const storage = getStorage();
export const googleProvider = new GoogleAuthProvider();
export const servertimestamp = serverTimestamp();


// helper functions

export async function getUserWithUserName(username) {
  const usersRef = collection(db, "users");

  const userQuery = query(
    usersRef,
    where("username", "==", username),
    limit(1)
  );

  const user = await getDocs(userQuery);

  return user.docs[0];
}

export function postToJSON(doc) {
  const data = doc.data();
  if (!data) {
    return false;
  }

  return {
    ...data,
    //because firebase timestamps are not serializable
    createdAt: data.createdAt.toMillis(),
    updatedAt: data.createdAt.toMillis(),
  };
}
