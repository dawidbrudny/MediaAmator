import { useRef, useEffect, useCallback } from 'react';

//  Redux
import { handleLoginProcess, getLoginStatus } from './utils/authenticationFunctions';
import { useLoginSelector, useLoginDispatch } from '../../../redux/hooks';
import { setLoginState } from '../../../redux/loginSlice';

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
        <>
        <section>
            <h2>{login ? 'Panel użytkownika' : 'Logowanie'}</h2>
                {!login ? 
                (<>
                <Form onSave={handleSubmit} ref={loginForm}>
                    <Input type='email' name='email' id='email' label='Email' />
                    <Input type='password' name='password' id='password' label='Hasło' />
                    <Button className='button def-hover login' type='submit'>Zaloguj</Button>
                </Form>
                <Button className='button def-hover previous-page' previousPage>Powrót</Button>
                </>) 
                : 
                (<UserPanel />)
                }
        </section>
        </>
    );
};

export default LoginPanel;
