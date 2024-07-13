import { useState, useEffect } from 'react';
import Product, { ProductProps } from './Product';
import Container from '../../UI/Container';


type ProductListProps = {
    data: object[];
};

const ProductList = ({ data }: ProductListProps) => {
    const [loadingInfo, setLoadingInfo] = useState<string>('Loading...');

    function handleLoadingInfo(data: object[]) {
        setTimeout(() => {
            if (data.length === 0) setLoadingInfo('Brak produktów')
        }, 5000)
    }

    useEffect(() => {
        handleLoadingInfo(data);
    }, [data])

    return (
            <section className='product-list container'>
                <h2>{data.length > 0 ? 'Lista produktów' : loadingInfo}</h2>
                {data.map((product: object) => {
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
            </section>
    );
};

export default ProductList;
