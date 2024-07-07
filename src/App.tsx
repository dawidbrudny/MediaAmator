// import { useState } from 'react';
import './style/font-awesome-config.js';

// Components
import Navbar from './components/Navbar';
import ProductsList from './components/Product/ProductsList';

import './App.scss';

const App = () => {
    // const [products, setProducts] = useState<Array<object>>([]);

    return (
        <>
            <Navbar />
            <ProductsList />
        </>
    );
};

export default App;

