import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../../redux/hooks";

import styled from "styled-components";
import Container from "../../UI/Container";
import ChooseHeader from "../../UI/ChooseHeader";
import Button from "../../UI/Button.tsx";
import UserPanel from "./UserPanel.tsx";
import LoginForm from "./LoginForm.tsx";
import { setRedirectAfterLogin } from "../../../redux/loginSlice.ts";

const LoginPanel = () => {
  const [loadingInfo, setLoadingInfo] = useState<boolean>(true);
  const login = useAppSelector((state) => state.login.isLoggedIn);
  const redirect = useAppSelector((state) => state.login.redirectAfterLogin);
  const dispatch = useAppDispatch();

  function handleRenderingComponents(loading: boolean, login: null | boolean) {
    if (loading) {
      return (
        <Header as={ChooseHeader} level={2}>
          Loading...
        </Header>
      );
    } else if (login && redirect) {
      return (
        <>
          <Header as={ChooseHeader} level={2}>
            Dokończ płatność
          </Header>
          <Button link={redirect}>Przejdź</Button>
        </>
      );
    } else {
      return (
        <>
          <Header as={ChooseHeader} level={2}>
            {login ? "Panel użytkownika" : "Logowanie"}
          </Header>
          {login ? <UserPanel /> : <LoginForm />}
        </>
      );
    }
  }

  useEffect(() => {
    setTimeout(() => {
      setLoadingInfo(false);
    }, 700);
    if (login && redirect) {
      dispatch(setRedirectAfterLogin(null));
    }
  }, []);

  return <>{handleRenderingComponents(loadingInfo, login)}</>;
};

//  --- Styling ---
const Header = styled(Container)``;

export default LoginPanel;
