import {     
    type ComponentPropsWithoutRef,
    type ReactNode,
} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';


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
            <Link to={link}><StyledButton {...props}>{children}</StyledButton></Link>
        )
    } else if (previousPage) { //   Previous Page Button
        return (
            <StyledButton {...props} onClick={() => moveBack(-1)}>{children}</StyledButton>
        );
    } else if ('type' in props) { //   Submit Button
        const { type } = props;

            if (type === 'submit') {
                return (
                    <StyledButton {...props}>{children}</StyledButton>
                );
            }
    }

    return (
        <StyledButton {...props} onClick={onClick}>{children}</StyledButton>
    );
};

export default Button;

//  --- Styling ---
const StyledButton = styled.button`
    text-align: center;
    letter-spacing: 1px;
    color: black;
    border-radius: 0;
    border: 1.5px solid black;
    padding: 10px 20px;
    transition: .3s ease-in-out;
    font-family: 'Montserrat', sans-serif;
    font-weight: 500;
    cursor: pointer;

    &:hover {
        background-color: rgb(255, 213, 0);
        color: black;
        box-shadow: -4px 4px 2px rgb(169, 169, 169);
        font-weight: 700;
        letter-spacing: 2px;
    }
`;