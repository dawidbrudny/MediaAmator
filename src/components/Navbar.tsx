import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLoginSelector } from '../redux/hooks';
import styled from 'styled-components';

import Nav from './UI/Nav';
import Container from './UI/Container';
import Button from './UI/Button';
import Headers from './UI/ChooseHeader';

const Navbar = () => {
    const login = useLoginSelector(state => state.login.isLoggedIn);

    return (
        <StyledNav>
            <NavContainer>

                <LogoContainer as={Headers} level={1}>
                    <span>Media<FontAwesomeIcon icon='arrows-left-right-to-line' /></span>Amator
                </LogoContainer>

                <NavbarButtons>
                    <LoginButton link='/login'>
                    {login ? 'Konto' : 'Login'}
                    </LoginButton>
                    <ShoppingCartButton>
                        <FontAwesomeIcon icon='shopping-cart' />
                        <span>: 4</span>
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
    height: 100%;
    margin: 0 auto;
    padding: 0 10px;
`;

const LoginButton = styled(Button)`
    width: 120px;
    height: 35px;
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

    > ${ShoppingCartButton}, > * > ${LoginButton} {
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
