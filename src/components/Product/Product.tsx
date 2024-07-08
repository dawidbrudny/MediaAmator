import Button from '../UI/Button';

export type ProductProps = {
    image: {
        src: string;
        alt: string;
    };
    name: string;
    price: number;
};

const Product = ({ image, name, price }: ProductProps) => {
    return (
        <section className='product-container'>
            <div className="product-image-container">
                <img className='product-image' {...image} />
            </div>
            <div className='product-info'>
                <h3>{name}</h3>
                <strong>{price.toFixed(2)} PLN</strong>
            </div>
            <Button className='button more-info info'>więcej...</Button>
            <Button className='button add info'>Do koszyka</Button>
        </section>
    );
};

export default Product;
