import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppSelector } from '../../redux/hooks.ts';
import styled from 'styled-components';

import Nav from './Nav.tsx';
import Container from './Container.tsx';
import Button from './Button.tsx';
import Headers from './ChooseHeader.tsx';

const Navbar = () => {
    const login = useAppSelector(state => state.login.isLoggedIn);
    const cart = useAppSelector(state => state.cart);
    const [loading, setLoading] = useState(true);

    function showAccountOption() {
        return login ? 'Konto' : 'Login';
    }

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 500);
    }, []);

    return (
        <StyledNav>
            <NavContainer>

                <LogoContainer as={Headers} level={1}>
                    <span>Media<FontAwesomeIcon icon='arrows-left-right-to-line' /></span>Amator
                </LogoContainer>

                <NavbarButtons>
                    <LoginButton link='/login'>
                    {!loading ? showAccountOption() : '. . .'}
                    </LoginButton>
                    <ShoppingCartButton link='/cart'>
                        <FontAwesomeIcon icon='shopping-cart' />
                        {cart.quantity > 0 && <span>: {cart.quantity}</span>}
                    </ShoppingCartButton>
                </NavbarButtons>

            </NavContainer>
        </StyledNav>
    );
};

//  --- Styling ---
const StyledNav = styled(Nav)`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 80px;
    background-image: linear-gradient(to right, rgb(145, 0, 0), rgb(0, 0, 0));
    box-shadow: 2px 0 4px black;
`;

const LogoContainer = styled(Container)``;
const NavContainer = styled.section`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 70%;
    max-width: 1440px;
    height: 100%;
    margin: 0 auto;
`;

const LoginButton = styled(Button)`
    width: 120px;
    min-height: 35px;
    font-size: 14.5px;
    margin-right: 30px;
`;

const ShoppingCartButton = styled(Button)`
    width: 75px;
    height: 40px;
    font-size: 20px;
    color: white;
`;

const NavbarButtons = styled.section`
    display: flex;
    justify-content: space-between;
    align-items: center;
    align-self: center;

    > * > ${ShoppingCartButton}, > * > ${LoginButton} {
        background-color: rgb(150, 0, 0);
        color: white;
        border: 1.5px solid white;
        padding: 0;

        &:hover {
            background-color: rgb(255, 213, 0);
            border: 0;
            color: black;
            letter-spacing: 2.5px;
            box-shadow: none;
        }
    }
`;

export default Navbar;
