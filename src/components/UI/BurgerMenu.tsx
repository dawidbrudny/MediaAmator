import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";

import styled from "styled-components";

const BurgerMenu = ({ children }: { children: ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function toggleMenu() {
    setIsMenuOpen(!isMenuOpen);
  }

  return (
    <>
      <Container>
        <MenuBtn $isOpen={isMenuOpen} onClick={toggleMenu}>
          {children}
        </MenuBtn>
      </Container>
      <Menu $isOpen={isMenuOpen}>
        <li>
          <Link to="/shop" onClick={toggleMenu}>
            Sklep
          </Link>
        </li>
        <li>
          <Link to="/cart" onClick={toggleMenu}>
            Koszyk
          </Link>
        </li>
        <li>
          <Link to="/login" onClick={toggleMenu}>
            Login
          </Link>
        </li>
      </Menu>
    </>
  );
};

//  --- Styling ---
const Container = styled.nav`
  display: none;
  position: absolute;

  @media (max-width: 1000px) {
    display: block;
  }
`;

const MenuBtn = styled.button<{ $isOpen: boolean }>`
  position: relative;
  top: 45px;
  border: 2px solid white;
  padding: 8px 20px;
  min-width: 120px;
  font-family: "Montserrat", sans-serif;
  font-weight: ${({ $isOpen }) => ($isOpen ? "700" : "500")};
  font-size: 15px;
  background-color: ${({ $isOpen }) => ($isOpen ? "rgb(255, 213, 0)" : "rgb(50, 0, 0)")};
  color: ${({ $isOpen }) => ($isOpen ? "black" : "white")};
  user-select: none;
  cursor: pointer;
`;
const Menu = styled.ul<{ $isOpen: boolean }>`
  display: none;
  flex-direction: column;
  position: absolute;
  background-color: white;
  top: 82px;
  margin: 0 auto;
  min-width: 300px;
  padding: 30px 10px;
  text-align: center;
  list-style: none;
  z-index: -1;
  transition: 0.2s ease-in-out;

  > * {
    margin: 5px 0;
  }

  @media (max-width: 1000px) {
    display: ${({ $isOpen }) => ($isOpen ? "flex" : "none")};

    > * {
      &:hover {
        color: rgb(130, 0, 0);
        font-weight: bold;
      }
    }
  }
`;

export default BurgerMenu;
