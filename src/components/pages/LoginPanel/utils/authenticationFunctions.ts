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

export async function handleLoginProcess(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(auth, email, password);
}

export async function handleLogoutProcess(): Promise<void> {
    await signOut(auth);
}
