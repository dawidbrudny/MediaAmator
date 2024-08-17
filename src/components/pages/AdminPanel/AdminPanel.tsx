import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../../redux/hooks";
import { setAdminScreen, AdminPages } from "../../../redux/screenSlice";

import Screen from "../Screen/Screen";
import AddProduct from "./pages/AddProduct";
import DeleteProduct from "./pages/DeleteProduct";
import UsersList from "./pages/UsersList";

import Container from "../../UI/Container";
import Headers from "../../UI/ChooseHeader";
import styled from "styled-components";

const AdminPanel = () => {
  const [loadingInfo, setLoadingInfo] = useState<boolean>(true);
  const dispatch = useAppDispatch();
  const adminStatus = useAppSelector((state) => state.login.userData?.status);
  const adminPage = useAppSelector((state) => state.screen.adminPage);

  function renderPage() {
    switch (adminPage) {
      case "add-product":
        return <AddProduct />;
      case "delete-product":
        return <DeleteProduct />;
      case "users-list":
        return <UsersList />;
      default:
        return <AddProduct />;
    }
  }

  function handleRenderingComponents(loading: boolean) {
    if (loading) {
      return (
        <Header as={Headers} level={2}>
          Loading...
        </Header>
      );
    } else {
      return (
        <>
          {adminStatus === "admin" ? (
            <>
              <Header as={Headers} level={2}>
                Panel administratora
              </Header>

              <PanelContainer>
                <AdminNavigation>
                  <Header as={Headers} level={3}>
                    Opcje administartora
                  </Header>
                  <Menu>
                    <Option onClick={() => handleOptionClick("add-product")}>Dodaj produkt</Option>
                    <Option onClick={() => handleOptionClick("delete-product")}>Usuń produkt</Option>
                    <Option onClick={() => handleOptionClick("users-list")}>Użytkownicy</Option>
                  </Menu>
                </AdminNavigation>

                <Screen>{renderPage()}</Screen>
              </PanelContainer>
            </>
          ) : (
            <Header as={Headers} level={2}>
              Brak dostępu
            </Header>
          )}
        </>
      );
    }
  }

  function handleOptionClick(option: AdminPages) {
    dispatch(setAdminScreen(option));
  }

  useEffect(() => {
    setTimeout(() => {
      setLoadingInfo(false);
    }, 1000);
  }, []);

  return <>{handleRenderingComponents(loadingInfo)}</>;
};

//  --- Stytling ---

const AdminNavigation = styled.nav`
  flex-basis: 20%;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 300px;
  max-height: 300px;
  padding: 50px 0 30px 0;

  * {
    margin: 10px 0;
  }
`;

const Option = styled.li``;
const Menu = styled.ul`
  list-style: none;

  ${Option} {
    cursor: pointer;
  }

  ${Option}:hover {
    color: rgb(150, 0, 0);
  }

  ${Option}:first-child {
    margin: 0;
  }
`;

const Header = styled(Container)``;

const PanelContainer = styled.section`
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

    > ${AdminNavigation} {
      flex-direction: row;
      justify-content: space-around;
      padding: 10px;
      margin-bottom: 30px;

      @media (max-width: 1000px) {
        flex-basis: 40%;
        flex-direction: column;

        ${Menu} {
          flex-direction: column;
        }
      }
    }

    > ${AdminNavigation} > ${Menu} {
      display: flex;

      ${Option} {
        margin: 0;
        padding: 0 15px;
        border-right: 1px solid black;

        &:last-child {
          border-right: none;
        }

        @media (max-width: 1000px) {
          border-right: none;
          margin: 5px 0;
        }
      }
    }
  }
`;

export default AdminPanel;
