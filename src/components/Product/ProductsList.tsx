// import ProductContainer from './ProductContainer';
import Product, { ProductProps } from './Product';
import ProductContainer from './ProductContainer';


type ProductListProps = {
    data: object[];
};

const ProductList = ({ data }: ProductListProps) => {
    return (
        <main className='product-list'>
            <h2>Lista zakupów</h2>
            <section className='product-list-container'>
            {data.map((product: object) => {
                const obj = product as ProductProps;

                return (
                        <ProductContainer
                        as={Product}
                        key={obj.name}
                        image={obj.image}
                        name={obj.name}
                        price={obj.price}
                        />
                )
            })}
            </section>
        </main>
    );
};

export default ProductList;
