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
  const banned = useAppSelector((state) => state.login.banned);
  const dispatch = useAppDispatch();

  function handleRenderingComponents(loading: boolean, login: null | boolean) {
    if (loading) {
      return (
        <Header as={ChooseHeader} level={2}>
          Loading...
        </Header>
      );
    } else if (!banned && login && redirect) {
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
    if (banned === null) {
      setLoadingInfo(true);
    }

    setTimeout(() => {
      setLoadingInfo(false);
    }, 1000);
    if (login && redirect) {
      dispatch(setRedirectAfterLogin(null));
    }
  }, [banned]);

  return <>{handleRenderingComponents(loadingInfo, login)}</>;
};

//  --- Styling ---
const Header = styled(Container)``;

export default LoginPanel;
