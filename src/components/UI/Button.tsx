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

    if (link) { //  Link Button
        return (
            <Link to={link}><button {...props}>{children}</button></Link>
        )
    } else if (previousPage) { //   Previous Page Button
        return (
            <button {...props} onClick={() => moveBack(-1)}>{children}</button>
        );
    } else if ('type' in props) { //   Submit Button
        const { type } = props;

            if (type === 'submit') {
                return (
                    <button {...props}>{children}</button>
                );
            }
    }

    return (
        <button {...props} onClick={onClick}>{children}</button>
    );
};

export default Button;
