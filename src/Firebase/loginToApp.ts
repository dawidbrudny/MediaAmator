import { auth } from './firebase-config';
import { signInWithEmailAndPassword } from 'firebase/auth';

type loginToPanel = {
    email: string;
    password: string;
}

export function loginToPanel({email, password}: loginToPanel) {
    signInWithEmailAndPassword(auth, email, password)
        .then(() => {
            // Zalogowano pomyślnie
            alert('Zalogowano pomyślnie!');
        })
        .catch((error) => {
            // Błąd logowania
            alert(`Błąd logowania: ${error.message}`);
        });
}