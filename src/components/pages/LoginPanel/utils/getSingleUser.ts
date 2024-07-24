import { db } from "../../../../configs/firebase-config";
import { getDoc, doc } from "firebase/firestore";


export async function getSingleUser(documentId: string) {
    const docRef = doc(db, 'users', documentId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data();
      } else {
        console.log("Nie znaleziono dokumentu!");
        return null;
      }
}