import { auth } from '../../../../configs/firebase-config';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';

export async function getLoginStatus(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
}

export async function handleLoginProcess(email: string, password: string): Promise<void | any> {
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
        console.error('Błąd logowania:', error);
        return error.code;
    }
}

export async function handleLogoutProcess(): Promise<void> {
    await signOut(auth);
}
