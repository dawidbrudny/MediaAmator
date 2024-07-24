import { useState, useEffect } from 'react';
import { useAppSelector } from '../../../redux/hooks';

import styled from 'styled-components';
import Product, { ProductProps } from './Product';
import Container from '../../UI/Container';
import ChooseHeader from '../../UI/ChooseHeader';

const ProductList = () => {
    const [loadingInfo, setLoadingInfo] = useState<string>('Loading...');
    const products = useAppSelector((state) => state.products.products);


    useEffect(() => {
            setTimeout(() => {
                if (products.length === 0) setLoadingInfo('Brak produktów')
            }, 5000);
    }, [products]);

    return (
        <ShopList>
            <Header as={ChooseHeader} level={2}>{products.length > 0 ? 'Lista produktów' : loadingInfo}</Header>
                
            {products.map((product: object) => {
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
    justify-content: center;
    display: flex;
    flex-wrap: wrap;
`;

const Header = styled(Container)``;

export default ProductList;
