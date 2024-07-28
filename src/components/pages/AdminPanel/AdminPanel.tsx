import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../../redux/hooks';
import { setAdminScreen, AdminPages } from '../../../redux/screenSlice'; 

import Screen from '../Screen/Screen';
import AddProduct from '../AdminPanel/AddProduct';
import DeleteProduct from '../AdminPanel/DeleteProduct';

import Container from '../../UI/Container';
import ChooseHeader from '../../UI/ChooseHeader';

const AdminPanel = () => {
    const [loadingInfo, setLoadingInfo] = useState<boolean>(true);
    const dispatch = useAppDispatch();
    const adminStatus = useAppSelector(state => state.login.userData?.status);
    const adminPage = useAppSelector(state => state.screen.adminPage);

    function renderPage() {
        switch (adminPage) {
            case 'add-product':
                return <AddProduct />;
            case 'delete-product':
                return <DeleteProduct />;
            default:
                return <AddProduct />;
        }
    }

    function handleRenderingComponents(loading: boolean) {
        if (loading) {
            return (<Header as={ChooseHeader} level={2}>Loading...</Header>);
        } else {
            return (
                <>
                    {adminStatus === 'admin' ? 
                    <>
                    <Header as={ChooseHeader} level={2}>Panel administratora</Header>

                    <PanelContainer>
                    <AdminNavigation>
                        <Menu>
                            <Option onClick={() => handleOptionClick('add-product')}>Dodaj produkt</Option>
                            <Option onClick={() => handleOptionClick('delete-product')}>Usuń produkt</Option>
                        </Menu>
                    </AdminNavigation>

                    <Screen>{renderPage()}</Screen>
                    </PanelContainer>
                    </>
                    :
                    <Header as={ChooseHeader} level={2}>Brak dostępu</Header>
                    }
                </>
            )
        }
    }

    function handleOptionClick(option: AdminPages) {
        dispatch(setAdminScreen(option));
    }

    useEffect(() => {
        setTimeout(() => {
            setLoadingInfo(false);
        }, 500);
    }, []);

    return (
        <>
            {handleRenderingComponents(loadingInfo)}
        </>
    );
};

//  --- Stytling ---
import styled from 'styled-components';

const PanelContainer = styled.section`
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    > * {
        border: 1.5px solid black;
        background-color: white;
    }
`;

const AdminNavigation = styled.nav`
    flex-basis: 20%;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 300px;
    max-height: 300px;
    padding: 50px 0 30px 0;
    margin-right: 40px;

    * {
        margin: 10px 0;
    }
`;

const Option = styled.li``;
const Menu = styled.ul`
    list-style: none;
    margin: 0;

    ${Option} {
        cursor: pointer;
    }

    ${Option}:hover {
        color: rgb(150, 0, 0);
        font-weight: bold;
    }

    ${Option}:first-child {
        margin: 0;
    }
`;

const Header = styled(Container)``;

export default AdminPanel;
