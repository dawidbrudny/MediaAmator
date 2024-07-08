import { 
    type ElementType, 
    type ComponentPropsWithRef
} 
from 'react';

type ContainerProps<T extends ElementType> = {
    as?: T;
} & ComponentPropsWithRef<T>;

const Container = <C extends ElementType>({ as, ...props}: ContainerProps<C>) => {
    const Component = as || 'div';

    return (
        <Component {...props} />
    );
};

export default Container;



