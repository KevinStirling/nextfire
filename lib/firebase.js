import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import {
  getFirestore,
  collection,
  query,
  where,
  limit,
  getDoc,
  getDocs,
} from "firebase/firestore";
// import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA3sgYSw1VJjDQ6Z8C910ohQrFjRnzDdPQ",
  authDomain: "nextfire-339ec.firebaseapp.com",
  projectId: "nextfire-339ec",
  storageBucket: "nextfire-339ec.appspot.com",
  messagingSenderId: "502666051132",
  appId: "1:502666051132:web:8623f96bcf75361b0c0d39",
  measurementId: "G-Q0ECQ965T2",
};

export const firebase = initializeApp(firebaseConfig);

export const auth = getAuth(firebase);
export const googleAuthProvider = new GoogleAuthProvider();

export const firestore = getFirestore(firebase);
// export const storage = getStorage(firestore);

/// Helper functions

export async function getUserWithUsername(username) {
  const q = query(
    collection(firestore, "users"),
    where("username", "==", username),
    limit(1)
  );
  const userDoc = (await getDocs(q)).docs[0];

  return userDoc;
}

/**`
 * Converts a firestore document to JSON
 * @param  {DocumentSnapshot} doc
 */
export function postToJSON(doc) {
  const data = doc.data();
  return {
    ...data,
    createdAt: data.createdAt.toMillis(),
    updatedAt: data.updatedAt.toMillis(),
  };
}
