import { useNavigate, Link } from 'react-router-dom';
import { handleLogoutProcess, getLoginStatus } from './utils/authenticationFunctions';
import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import { setLoginState, setUserData } from '../../../redux/loginSlice';
import { setScreen, Pages } from '../../../redux/screenSlice';

import styled from 'styled-components';
import Button from '../../UI/Button';
import Container from '../../UI/Container';
import ChooseHeader from '../../UI/ChooseHeader';
import Screen from '../Screen/Screen';

//  Screen pages
import Settings from '../Screen/pages/Settings';
import Personal from '../Screen/pages/Personal';
import Commentary from '../Screen/pages/Commentary';
import Purchases from '../Screen/pages/Purchases';
import Contact from '../Screen/pages/Contact';

const UserPanel = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const userData = useAppSelector(state => state.login.userData);
    const page = useAppSelector(state => state.screen.page);

    async function handleLogoutClick() {
        handleLogoutProcess().then(() => {
            getLoginStatus().then(response => dispatch(setLoginState(response)))
            .then(() => navigate('/'));
            dispatch(setUserData(null));
        });
    }

    function handleBackToShopping() {
        navigate('/shopping');
    }

    function renderPage() {
        switch (page) {
            case 'settings':
                return <Settings />;
            case 'personal':
                return <Personal />;
            case 'commentary':
                return <Commentary />;
            case 'purchases':
                return <Purchases />;
            case 'contact':
                return <Contact />;
            default:
                return <Settings />;
        }
    }

    function handleOptionClick(option: Pages) {
        dispatch(setScreen(option));
    }

    return (
        <UserPanelContainer>
                
            <UserNavigation>
                <Nickname as={ChooseHeader} level={3}>{userData?.nickname}</Nickname>
                <LogoutButton onClick={handleLogoutClick}>Wyloguj</LogoutButton>
                <Menu>
                    <Option onClick={() => handleOptionClick('settings')}>Ustawienia konta</Option>
                    <Option onClick={() => handleOptionClick('personal')}>Zmień dane</Option>
                    <Option onClick={() => handleOptionClick('commentary')}>Komentarze</Option>
                    <Option onClick={() => handleOptionClick('purchases')}>Zamówienia</Option>
                    <Option onClick={() => handleOptionClick('contact')}>Kontakt</Option>
                    {userData?.status === 'admin' && (
                    <Option><Link to='/admin'>Panel administratora</Link></Option>
                    )}
                </Menu>
                <Button onClick={handleBackToShopping}>Powrót do zakupów</Button>
            </UserNavigation>

            <Screen>{renderPage()}</Screen>

        </UserPanelContainer>
    );
};

//  --- Styling ---
const LogoutButton = styled(Button)``;

const UserPanelContainer = styled.section`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    > * {
        border: 1.5px solid black;
        background-color: white;
    }
`;

const Nickname = styled(Container)``;
const UserNavigation = styled.nav`
    flex-basis: 20%;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 300px;
    max-height: 450px;
    padding: 50px 0 30px 0;
    margin-right: 40px;

    > :first-child {
        margin: 0;
    }

    * {
        margin: 10px 0;
    }
`;

const Option = styled.li``;
const Menu = styled.ul`
    list-style: none;
    margin: 15px;

    ${Option} {
        cursor: pointer;
    }

    ${Option}:hover {
        color: rgb(150, 0, 0);
        font-weight: bold;
    }
`;

export default UserPanel;
