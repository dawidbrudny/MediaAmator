import {     
    type ComponentPropsWithoutRef,
    type ReactNode,
    type MouseEventHandler,
} from 'react';

type ButtonProps = ComponentPropsWithoutRef<'button'> & {
    onClick?: () => void | MouseEventHandler<HTMLButtonElement>;
    children: ReactNode;
    to?: string;
};

const Button = ({ onClick, children, ...props }: ButtonProps) => {
    return (
        <button {...props} onClick={onClick}>{children}</button>
    );
};

export default Button;
