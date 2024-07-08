import {     
    type ComponentPropsWithoutRef,
    type ReactNode,
} from 'react';

import { Link, useNavigate } from 'react-router-dom';

type ButtonProps = ComponentPropsWithoutRef<'button'> & {
    onClick?: () => void;
    children: ReactNode;
    link?: string;
    previousPage?: true;
};

const Button = ({ onClick, children, link, previousPage, ...props }: ButtonProps) => {
    const moveBack = useNavigate();

    // Link Button
    if (link) {
        return (
            <Link to={link}><button {...props}>{children}</button></Link>
        )
    } else if (previousPage) {
        return (
            <button {...props} onClick={() => moveBack(-1)}>{children}</button>
        );
    }

    return (
        <button {...props} onClick={onClick}>{children}</button>
    );
};

export default Button;
