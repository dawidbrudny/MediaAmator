import { useNavigate } from 'react-router-dom';
import { handleLogoutProcess, getLoginStatus } from './utils/authenticationFunctions';
import { useLoginDispatch } from '../../../redux/hooks';
import { setLoginState } from '../../../redux/loginSlice';

import styled from 'styled-components';
import Button from '../../UI/Button';

const UserPanel = () => {
    const navigate = useNavigate();
    const dispatch = useLoginDispatch();
    async function handleClick() {
        handleLogoutProcess().then(() => {
            getLoginStatus().then(response => dispatch(setLoginState(response)))
            .then(() => navigate('/'));
        });
    }

    return (
        <>
            <p>Witaj w panelu użytkownika</p>

            <UserPanelButtons>
                <Button previousPage>Powrót</Button>
                <LogoutButton onClick={handleClick}>Wyloguj</LogoutButton>
            </UserPanelButtons>
        </>
    );
};

//  --- Styling ---
const LogoutButton = styled(Button)``;
const UserPanelButtons = styled.section`
    display: flex;
    justify-content: space-between;
    width: 300px;
    padding: 30px 0;

    > button:hover {
        letter-spacing: 1px;
    }
`;

export default UserPanel;
