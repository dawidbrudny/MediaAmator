import { useRef, useEffect, useCallback } from 'react';

//  Redux
import { handleLoginProcess, getLoginStatus } from './utils/authenticationFunctions';
import { useLoginSelector, useLoginDispatch } from '../../../redux/hooks';
import { setLoginState } from '../../../redux/loginSlice';

import styled from 'styled-components';
import Container from '../../UI/Container';
import ChooseHeader from '../../UI/ChooseHeader';
import Button from '../../UI/Button';
import Input from '../../UI/Input';
import Form, { FormHandle } from '../../UI/Form';
import UserPanel from './UserPanel';

const LoginPanel = () => {
    const login = useLoginSelector(state => state.login.isLoggedIn);
    const dispatch = useLoginDispatch();
    
    const loginForm = useRef<FormHandle>(null);
    const getLoginResponse = useCallback(async () => {
        getLoginStatus().then(response => dispatch(setLoginState(response)));
    }, [dispatch]);

    async function handleSubmit(data: unknown) {
        const { email, password } = data as { email: string, password: string };

        await handleLoginProcess(email, password).then(() => {
            getLoginResponse();
        });
    }

    useEffect(() => {
        getLoginResponse();
    }, [dispatch, getLoginResponse]);

    return (
        <section>
            <Header as={ChooseHeader} level={2}>{login ? 'Panel użytkownika' : 'Logowanie'}</Header>
                
                {!login ? 
                (<>
                <Form onSave={handleSubmit} ref={loginForm}>
                    <Input type='email' name='email' id='email' label='Email' />
                    <Input type='password' name='password' id='password' label='Hasło' />
                    <Button type='submit'>Zaloguj</Button>
                </Form>
                <UniquePrevButton previousPage>Powrót</UniquePrevButton>
                </>) 
                : 
                (<UserPanel />)
                }
        </section>
    );
};

//  --- Styling ---
const Header = styled(Container)``;
const UniquePrevButton = styled(Button)`margin: 40px;`;

export default LoginPanel;
