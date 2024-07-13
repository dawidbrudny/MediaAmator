import { useNavigate } from "react-router-dom";
import { handleLogoutProcess, getLoginStatus } from "./utils/authenticationFunctions";
import { useLoginDispatch } from "../../../redux/hooks";
import { setLoginState } from "../../../redux/loginSlice";

import Button from "../../UI/Button";

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
            <section className='logout-buttons'>
                <Button className='button def-hover previous-page' previousPage>Powrót</Button>
                <Button className='button def-hover' onClick={handleClick}>Wyloguj</Button>
            </section>
        </>
    );
};

export default UserPanel;
