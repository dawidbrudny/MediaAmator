import { useEffect, useState } from 'react';
import { db } from './firebase-config.ts';
import { collection, getDocs } from 'firebase/firestore';
import './style/font-awesome-config';

// Components
import Navbar from './components/Navbar';
import ProductsList from './components/Product/ProductsList';

// Styles
import './App.scss';

const App = () => {
    const [data, setData] = useState<Array<object>>([]);

    const getData = async () => {
        const snapshot = await getDocs(collection(db, 'products'));
        const data = snapshot.docs.map(doc => doc.data());
        setData(data);
    };

    useEffect(() => {
        getData();
    }, []);
    
    return (
        <>
            <Navbar />
            <ProductsList data={data} />
        </>
    );
};

export default App;

