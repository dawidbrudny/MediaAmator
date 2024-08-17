import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { handleLogoutProcess, getLoginStatus } from "./utils/authenticationFunctions";
import { useAppSelector, useAppDispatch } from "../../../redux/hooks";
import { setLoginState, setUserData } from "../../../redux/loginSlice";
import { setScreen, Pages } from "../../../redux/screenSlice";

import styled from "styled-components";
import Button from "../../UI/Button";
import Container from "../../UI/Container";
import Headers from "../../UI/ChooseHeader";
import Screen from "../Screen/Screen";

//  Screen pages
import Settings from "../Screen/pages/Settings";
import Commentary from "../Screen/pages/Commentary";
import Purchases from "../Screen/pages/Purchases";
import Contact from "../Screen/pages/Contact";

const UserPanel = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const banned = useAppSelector((state) => state.login.banned);
  const userData = useAppSelector((state) => state.login.userData);
  const page = useAppSelector((state) => state.screen.page);

  async function handleLogoutClick() {
    handleLogoutProcess().then(() => {
      getLoginStatus()
        .then((response) => dispatch(setLoginState(response)))
        .then(() => navigate("/"));
      dispatch(setUserData(null));
    });
  }

  function handleBackToShopping() {
    navigate("/shopping");
  }

  function renderPage() {
    switch (page) {
      case "settings":
        return <Settings />;
      case "commentary":
        return <Commentary />;
      case "purchases":
        return <Purchases />;
      case "contact":
        return <Contact />;
      default:
        return <Settings />;
    }
  }

  function handleOptionClick(option: Pages) {
    dispatch(setScreen(option));
  }

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, []);

  return (
    <>
      {isLoading ? (
        <p>Czekaj...</p>
      ) : (
        <>
          {banned ? (
            <p>Brak dostępu. Jesteś zbanowany.</p>
          ) : (
            <UserPanelContainer>
              <UserNavigation>
                <Header as={Headers} level={3}>
                  {userData?.nickname ? userData.nickname : "- - -"}
                </Header>
                <LogoutButton onClick={handleLogoutClick}>Wyloguj</LogoutButton>
                <Menu>
                  <Option onClick={() => handleOptionClick("settings")}>Ustawienia konta</Option>
                  <Option onClick={() => handleOptionClick("commentary")}>Komentarze</Option>
                  <Option onClick={() => handleOptionClick("purchases")}>Zamówienia</Option>
                  <Option onClick={() => handleOptionClick("contact")}>Kontakt</Option>
                  {userData?.status === "admin" && (
                    <Option>
                      <Link to="/admin">Panel administratora</Link>
                    </Option>
                  )}
                </Menu>
                <GoBackButton onClick={handleBackToShopping}>Powrót do zakupów</GoBackButton>
              </UserNavigation>

              <Screen>{renderPage()}</Screen>
            </UserPanelContainer>
          )}
        </>
      )}
    </>
  );
};

//  --- Styling ---

const LogoutButton = styled(Button)``;
const GoBackButton = styled(Button)``;
const Header = styled(Container)``;
const UserNavigation = styled.nav`
  flex-basis: 20%;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 300px;
  max-height: 450px;
  padding: 50px 0 30px 0;

  > :first-child {
    margin: 0;
  }

  * {
    margin: 10px 0;
  }
`;

const Option = styled.li``;
const Menu = styled.ul`
  list-style: none;
  margin: 15px;

  ${Option} {
    cursor: pointer;
  }

  ${Option}:hover {
    color: rgb(150, 0, 0);
  }
`;

const UserPanelContainer = styled.section`
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;

  > * {
    border: 1.5px solid black;
    background-color: white;
  }

  @media (max-width: 1650px) {
    justify-content: center;

    > * {
      flex-basis: 100%;
    }

    > ${UserNavigation} {
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: center;
      margin-bottom: 30px;
      padding: 20px 50px;

      @media (max-width: 1100px) {
        flex-basis: 40%;
        padding: 30px 0;
      }

      > ${LogoutButton} {
        width: 110px;
        order: 1;

        @media (max-width: 1100px) {
          order: 0;
          margin: 10px 80px 0 80px;
        }
      }

      > ${GoBackButton} {
        width: 200px;
        order: 2;
      }

      > button {
        margin: 0 10px;
      }

      > ${Menu} {
        display: flex;
        flex-basis: 100%;
        max-width: 600px;
        min-width: 500px;
        margin: 7px;

        > ${Option} {
          flex-grow: 1;
          border-right: 1px solid black;

          &:last-child {
            border-right: none;
          }
        }

        @media (max-width: 1100px) {
          flex-direction: column;

          > ${Option} {
            border-right: none;
            padding: 0;
          }
        }
      }
    }
  }
`;

export default UserPanel;
