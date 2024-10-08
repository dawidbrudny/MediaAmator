// Redux
import { useAppSelector, useAppDispatch } from "./redux/hooks.ts";
import { getLoginStatusAsync, getSingleUserAsync, getCurrentUserBanStatusAsync } from "./redux/loginSlice.ts";
import { fetchProducts } from "./redux/productsSlice.ts";

// React Router DOM
import { Routes, Route, Navigate } from "react-router-dom";

// Components
import Navbar from "./components/UI/Navbar.tsx";
import ProductsList from "./components/pages/ShopList/ProductsList.tsx";
import ProductDetails from "./components/pages/ShopList/ProductDetails.tsx";
import LoginPanel from "./components/pages/LoginPanel/LoginPanel.tsx";
import Register from "./components/pages/LoginPanel/Register.tsx";
import AdminPanel from "./components/pages/AdminPanel/AdminPanel.tsx";
import Main from "./components/UI/Main.tsx";
import Cart from "./components/pages/Cart/Cart.tsx";
import PaymentForm from "./components/pages/Cart/PaymentForm.tsx";

// Styles
import { createGlobalStyle } from "styled-components";
import { HelmetProvider } from "react-helmet-async";
import "./configs/font-awesome-config.ts";

// Firebase
import { auth } from "./configs/firebase-config.ts";

import { useEffect } from "react";

const App = () => {
  const dispatch = useAppDispatch();
  const productsStatus = useAppSelector((state) => state.products.status);
  const login = useAppSelector((state) => state.login.isLoggedIn);

  useEffect(() => {
    dispatch(getLoginStatusAsync());

    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      if (currentUser) {
        dispatch(getSingleUserAsync(currentUser.email!));
        if (login) {
          dispatch(getCurrentUserBanStatusAsync());
        }
      }
    });

    if (productsStatus === "idle") {
      dispatch(fetchProducts());
    }
    return () => unsubscribe();
  }, [dispatch, login, productsStatus]);

  return (
    <>
      {/*  --- Helmet, Global Style --- */}
      <HelmetProvider>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Exo+2:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
      </HelmetProvider>
      <GlobalStyle />

      <Navbar />
      <Main>
        <Routes>
          <Route path="/" element={<Navigate to="/shoplist" />} />
          <Route path="/shoplist" element={<ProductsList />} />
          <Route path="/details" element={<ProductDetails />} />
          <Route path="/login" element={<LoginPanel />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<PaymentForm />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Main>
    </>
  );
};

//  --- Global Styling ---
const GlobalStyle = createGlobalStyle`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    html {
        font-family: 'roboto', sans-serif;
     }

    body {
        background-color: #c2c2c2;
    }

    a {
        text-decoration: none;
        color: inherit;
    }
`;

export default App;
