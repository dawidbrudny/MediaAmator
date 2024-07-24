import { useState, useEffect } from 'react'; 
import { useAppSelector } from '../../../redux/hooks';

import styled from 'styled-components';
import Container from '../../UI/Container';
import ChooseHeader from '../../UI/ChooseHeader';
import UserPanel from './UserPanel.tsx';
import LoginForm from './LoginForm.tsx';

const LoginPanel = () => {
    const [loadingInfo, setLoadingInfo] = useState<boolean>(true);
    const login = useAppSelector(state => state.login.isLoggedIn);

    function handleRenderingComponents(loading: boolean, login: null |boolean) {
        if (loading) {
            return (<Header as={ChooseHeader} level={2}>Loading...</Header>);
        } else {
            return (
                <>
                <Header as={ChooseHeader} level={2}>
                    {login ? 'Panel użytkownika' : 'Logowanie'}
                </Header>
                {login ? <UserPanel /> : <LoginForm />}
                </>
            )
        }
    }

    useEffect(() => {
        setTimeout(() => {
            setLoadingInfo(false);
        }, 500);
    }, []);

    return (
        <>
            {handleRenderingComponents(loadingInfo, login)}
        </>
    );
};

//  --- Styling ---
const Header = styled(Container)``;

export default LoginPanel;
