import { useRef, useEffect, useCallback } from 'react';

//  Redux
import { handleLoginProcess, getLoginStatus } from './utils/authenticationFunctions';
import { useAppDispatch } from '../../../redux/hooks';
import { setLoginState } from '../../../redux/loginSlice';

import Form, { FormHandle } from '../../UI/Form';
import Button from '../../UI/Button';
import Input from '../../UI/Input';
import styled from 'styled-components';

const LoginForm = () => {
    const dispatch = useAppDispatch();
    const loginForm = useRef<FormHandle>(null);
    
    const getLoginResponse = useCallback(async () => {
        getLoginStatus().then(response => {
            dispatch(setLoginState(response))
        });
    }, [dispatch]);

    async function handleSubmit(data: unknown) {
        const { email, password } = data as { email: string, password: string };
    
        await handleLoginProcess(email, password).then(() => {
            getLoginResponse();
            loginForm.current?.clear();
        });        
    }

    useEffect(() => {
        getLoginResponse();
    }, [getLoginResponse]);

    return (
        <>
            <LoginFormContainer onSave={handleSubmit} ref={loginForm}>
                <Input type='email' name='email' id='email' label='Email' />
                <Input type='password' name='password' id='password' label='Hasło' />
                <Button type='submit'>Zaloguj</Button>
            </LoginFormContainer>
            <UniquePrevButton previousPage>Powrót</UniquePrevButton>
        </>
    );
};

//  --- Styling ---
const UniquePrevButton = styled(Button)`
    flex-basis: 100%;
    display: block;
    margin: 30px 60% 0 60%;
`;

const LoginFormContainer = styled(Form)`
    max-width: 400px;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    background-color: white;
    padding: 30px 0;
    border: 1.5px solid black;

    > * {
        flex-basis: 100%;
    }

    > button {
        flex-basis: 30%;
        width: 50px;
        height: 35px;
        margin-top: 20px;
    }

    > input {
        flex-basis: 70%;
        margin: 10px 50px;
    }
`;

export default LoginForm;
