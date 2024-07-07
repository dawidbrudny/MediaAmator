import { 
    type ElementType, 
    type ComponentPropsWithRef
} 
from 'react';

type ProductContainerProps<T extends ElementType> = {
    as?: T;
} & ComponentPropsWithRef<T>;

const ProductContainer = <C extends ElementType>({ as, ...props}: ProductContainerProps<C>) => {
    const Component = as || 'section';

    return (
        <Component {...props} />
    );
};

export default ProductContainer;



