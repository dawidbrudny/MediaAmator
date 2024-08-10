import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../configs/firebase-config';

export const getBanStatus = async (): Promise<boolean | null> => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      throw new Error('Użytkownik nie jest zalogowany');
    }

    const userEmail = user.email;
    if (!userEmail) {
      throw new Error('Email użytkownika nie jest dostępny');
    }

    const userDocRef = doc(db, 'users', userEmail);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      throw new Error('Dokument użytkownika nie istnieje');
    }

    const userData = userDoc.data();
    return userData?.banned ?? null;
  } catch (error) {
    console.error('Błąd podczas pobierania statusu bana:', error);
    return null;
  }
};