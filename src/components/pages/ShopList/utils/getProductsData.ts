//  Firebase
import { db } from '../../../../configs/firebase-config.ts';
import { collection, getDocs } from 'firebase/firestore';

import { ProductProps } from '../Product.tsx';

export async function getProductsData(): Promise<ProductProps[]> {
    try {
        const snapshot = await getDocs(collection(db, 'products'));
        const data: ProductProps[] = snapshot.docs.map(doc => ({
            id: doc.id,
            image: doc.data().image,
            name: doc.data().name,
            price: doc.data().price
        }) as ProductProps);
        return data;
    } catch (error) {
        throw new Error(error as string);
    }
}