import { useState, useEffect } from 'react';
import { getProductsData } from './utils/getProductsData';

import styled from 'styled-components';
import Product, { ProductProps } from './Product';
import Container from '../../UI/Container';
import ChooseHeader from '../../UI/ChooseHeader';

const ProductList = () => {
    const [loadingInfo, setLoadingInfo] = useState<string>('Loading...');
    const [productsData, setProductsData] = useState<Array<object>>([]);

    function handleLoadingInfo(data: object[]) {
        setTimeout(() => {
            if (data.length === 0) setLoadingInfo('Brak produktów')
        }, 5000)
    }

    useEffect(() => {
        getProductsData().then(data => setProductsData(data));
        handleLoadingInfo(productsData);
    }, [productsData])

    return (
            <ShopList>
                <Header as={ChooseHeader} level={2}>{productsData.length > 0 ? 'Lista produktów' : loadingInfo}</Header>
                
                {productsData.map((product: object) => {
                    const obj = product as ProductProps;

                    return (
                        <Container
                        as={Product}
                        key={obj.name}
                        image={obj.image}
                        name={obj.name}
                        price={obj.price}
                        />
                    )
                })}
            </ShopList>
    );
};

//  --- Styling ---
const ShopList = styled.section`
    flex-basis: 100%;
    display: flex;
    flex-wrap: wrap;
`;

const Header = styled(Container)`
    flex-basis: 100%;
    color: rgb(0, 0, 0);
    padding: 35px 0;
    font-family: 'Exo 2', sans-serif;
`;

export default ProductList;
