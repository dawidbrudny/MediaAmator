import { db } from '../../../../configs/firebase-config.ts';
import { collection, getDocs, Timestamp } from 'firebase/firestore';
import { ProductProps } from '../Product.tsx';
import { Commentary } from '../CommentarySection.tsx';

export async function getProductsData(): Promise<ProductProps[]> {
    try {
        const snapshot = await getDocs(collection(db, 'products'));
        const data: ProductProps[] = await Promise.all(snapshot.docs.map(async doc => {
            const productData = doc.data();
            const commentariesSnapshot = await getDocs(collection(doc.ref, 'commentaries'));
            const commentaries = commentariesSnapshot.docs.map(commentaryDoc => {
                const commentaryData = commentaryDoc.data();
                return {
                    id: commentaryDoc.id,
                    ...commentaryData,
                    timestamp: (commentaryData.timestamp as Timestamp).toDate().toISOString() 
                } as Commentary;
            });

            return {
                id: doc.id,
                image: productData.image,
                name: productData.name,
                price: productData.price,
                commentaries: commentaries
            } as ProductProps;
        }));
        return data;
    } catch (error) {
        throw new Error(error as string);
    }
}