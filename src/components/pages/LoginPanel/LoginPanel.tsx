import { type FormEvent, useRef } from 'react';
import { loginToPanel } from '../../../Firebase/loginToApp';

import Button from '../../UI/Button';

const LoginPanel = () => {
    const email = useRef<HTMLInputElement>(null);
    const password = useRef<HTMLInputElement>(null);

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        const emailValue = email.current!.value;
        const passwordValue = password.current!.value;
        console.log(emailValue, passwordValue);

        loginToPanel({ email: emailValue, password: passwordValue });
    }
    return (
        <>
        <section>
            <h2>Logowanie</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor='email'>E-mail</label>
                    <input type='email' name='email' id='email' ref={email} />
                    <label htmlFor='password'>Hasło</label>
                    <input type='password' name='password' id='password' ref={password} />
                    <Button className='button def-hover' type='submit'>Zaloguj</Button>
                </form>
                <Button className='button def-hover previous-page' previousPage>Powrót</Button>
        </section>
        </>
    );
};

export default LoginPanel;
