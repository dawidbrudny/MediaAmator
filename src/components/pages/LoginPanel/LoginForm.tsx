import { useRef, useState, useEffect, useCallback } from 'react';
import { z } from 'zod';
//  Redux
import { handleLoginProcess, getLoginStatus } from './utils/authenticationFunctions';
import { useAppDispatch } from '../../../redux/hooks';
import { setLoginState } from '../../../redux/loginSlice';

import { useNavigate } from 'react-router-dom';

import Form, { FormHandle } from '../../UI/Form';
import Button from '../../UI/Button';
import Input from '../../UI/Input';
import styled from 'styled-components';

const loginSchema = z.object({
    email: z.string().email({ message: "Nieprawidłowy adres email" }),
    password: z.string().min(6, { message: "Hasło musi mieć co najmniej 6 znaków" }),
});

const LoginForm = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const loginForm = useRef<FormHandle>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    
    const getLoginResponse = useCallback(async () => {
        getLoginStatus().then(response => {
            dispatch(setLoginState(response))
        });
    }, [dispatch]);

    async function handleSubmit(data: unknown) {
        const { email, password } = data as { email: string, password: string };

        const result = loginSchema.safeParse({ email, password });
        if (!result.success) {
            const newErrors: Record<string, string> = {};
            result.error.issues.forEach((issue) => {
                newErrors[issue.path[0]] = issue.message;
            });
        setErrors(newErrors);
        return;
        }
        setErrors({});

        await handleLoginProcess(email, password).then(() => {
            getLoginResponse();
            loginForm.current?.clear();
        });
    
        await handleLoginProcess(email, password).then(() => {
            getLoginResponse();
            loginForm.current?.clear();
        });
    }

    function handleBackToShopping() {
        navigate('/shopping');
    }

    useEffect(() => {
        getLoginResponse();
    }, [getLoginResponse]);

    return (
        <Container>
            <LoginFormContainer onSave={handleSubmit} ref={loginForm}>
                <Input type='email' name='email' id='email' label='Email' />
                {errors.email && <Error>{errors.email}</Error>}
                <Input type='password' name='password' id='password' label='Hasło' />
                {errors.password && <Error>{errors.password}</Error>}
                <Button type='submit'>Zaloguj</Button>
            </LoginFormContainer>
            <UniquePrevButton onClick={handleBackToShopping}>Powrót do zakupów</UniquePrevButton>
        </Container>
    );
};

//  --- Styling ---
const Container = styled.section`
`;

const UniquePrevButton = styled(Button)`
    flex-basis: 100%;
    display: block;
    margin: 30px auto;
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
        margin-top: 30px;
    }

    > label {
        margin: 10px 0;
    }

    > input {
        flex-basis: 70%;
        margin: 0 50px;
    }
`;

const Error = styled.span`
    color: rgb(150, 0, 0);
    font-size: 14px;
    margin: 5px 0;

    &:last-of-type {
        margin-bottom: 0;
    }
`;

export default LoginForm;
