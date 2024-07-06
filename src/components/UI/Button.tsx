import { 
    type FC,     
    type ComponentPropsWithRef,
    type ReactNode,
    type MouseEventHandler,
} from 'react';

type ButtonProps = ComponentPropsWithRef<'button'> & {
    onClick?: () => void | MouseEventHandler<HTMLButtonElement>;
    children: ReactNode;
    to?: string;
};

const Button: FC<ButtonProps> = ({ onClick, children, ...props }) => {
    return (
        <button {...props} onClick={onClick}>{children}</button>
    );
};

export default Button;
