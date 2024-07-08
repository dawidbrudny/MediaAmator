// React
import { useEffect, useState } from 'react';

// React Router DOM
import { Routes, Route, Navigate } from 'react-router-dom';

// Firebase
import { db } from './Firebase/firebase-config.ts';
import { collection, getDocs } from 'firebase/firestore';

// Components
import Navbar from './components/Navbar';
import ProductsList from './components/pages/ShopList/ProductsList.tsx';
import LoginPanel from './components/pages/LoginPanel/LoginPanel.tsx';
import { ProductProps } from './components/pages/ShopList/Product.tsx';

// Styles
import './App.scss';
import './style/font-awesome-config';

const App = () => {
    const [data, setData] = useState<Array<object>>([]);

    const getData = async (): Promise<object[]> => {
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
            return [];
        }
    };

    useEffect(() => {
        getData().then(data => setData(data));
    }, []);
    
    return (
        <>
            <Navbar />
            <main>
                <section className='main-container'>
                <Routes>
                    <Route path='/' element={<Navigate to='/shoplist' />} />
                    <Route path='/shoplist' element={<ProductsList data={data} />} />
                    <Route path='/login' element={<LoginPanel />} />
                </Routes>
                </section>
            </main>
        </>
    );
};

export default App;

