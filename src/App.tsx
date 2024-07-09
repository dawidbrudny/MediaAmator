// React
import { useEffect, useState } from 'react';

// React Router DOM
import { Routes, Route, Navigate } from 'react-router-dom';

import { getProductsData } from './Firebase/getProductsData.ts';

// Components
import Navbar from './components/Navbar';
import ProductsList from './components/pages/ShopList/ProductsList.tsx';
import LoginPanel from './components/pages/LoginPanel/LoginPanel.tsx';

// Styles
import './App.scss';
import './style/font-awesome-config';

const App = () => {
    const [productsData, setProductsData] = useState<Array<object>>([]);

    useEffect(() => {
        getProductsData().then(data => setProductsData(data));
    }, []);
    
    return (
        <>
            <Navbar />
            <main>
                <Routes>
                    <Route path='/' element={<Navigate to='/shoplist' />} />
                    <Route path='/shoplist' element={<ProductsList data={productsData} />} />
                    <Route path='/login' element={<LoginPanel />} />
                </Routes>
            </main>
        </>
    );
};

export default App;

