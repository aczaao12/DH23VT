import { db } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export async function getUserData(email) {
  const q = query(collection(db, "activities"), where("Email", "==", email));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}