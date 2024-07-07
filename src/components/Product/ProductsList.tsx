import ProductContainer from './ProductContainer';
import Product from './Product';

import MonitorIMG from '../../images/monitor.jpg';

const ProductList = () => {
    return (
        <main className='product-list'>
            <h2>Lista zakupów</h2>
            <section className='product-list-container'>
                <ProductContainer 
                as={Product} 
                image={{src: MonitorIMG, alt: 'monitor'}} 
                name='Acer Nitro QG240YS3BIPX' 
                price={20} 
            />
            <ProductContainer 
                as={Product} 
                image={{src: MonitorIMG, alt: 'monitor'}} 
                name='Acer Nitro QG240YS3BIPX' 
                price={20} 
            />
            <ProductContainer 
                as={Product} 
                image={{src: MonitorIMG, alt: 'monitor'}} 
                name='Acer Nitro QG240YS3BIPX' 
                price={20} 
            />
            <ProductContainer 
                as={Product} 
                image={{src: MonitorIMG, alt: 'monitor'}} 
                name='Acer Nitro QG240YS3BIPX' 
                price={20} 
            />
            <ProductContainer 
                as={Product} 
                image={{src: MonitorIMG, alt: 'monitor'}} 
                name='Acer Nitro QG240YS3BIPX' 
                price={20} 
            />
            </section>
        </main>
    );
};

export default ProductList;
