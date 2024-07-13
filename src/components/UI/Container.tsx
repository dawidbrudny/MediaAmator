import { 
    type ElementType, 
    type ComponentPropsWithoutRef
} 
from 'react';

type ContainerProps<T extends ElementType> = {
    as?: T;
} & ComponentPropsWithoutRef<T>;

const Container = <C extends ElementType>({ as, ...props}: ContainerProps<C>) => {
    const Component = as || 'div';

    return (
        <Component {...props} />
    );
};

export default Container;



