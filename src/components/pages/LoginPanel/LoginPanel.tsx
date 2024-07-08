import Button from "../../UI/Button";

const LoginPanel = () => {
    return (
        <>
            <h2>Logowanie</h2>
            <div className="login-panel">
                <form>
                    <label htmlFor="login">Login</label>
                    <input type="text" name="login" id="login" />
                    <label htmlFor="password">Hasło</label>
                    <input type="password" name="password" id="password" />
                    <button type="submit">Zaloguj</button>
                </form>
                <Button previousPage>Powrót</Button>
            </div>
        </>
    );
};

export default LoginPanel;
