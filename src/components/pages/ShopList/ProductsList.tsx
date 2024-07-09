import Product, { ProductProps } from './Product';
import Container from '../../UI/Container';


type ProductListProps = {
    data: object[];
};

const ProductList = ({ data }: ProductListProps) => {
    return (
            <section className='product-list container'>
                <h2>Lista zakupów</h2>
                {data.length === 0 && <div className='product no-products'>Brak produktów na stronie</div>}
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
