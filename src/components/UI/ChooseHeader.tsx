import { ReactNode } from "react";
import styled from "styled-components";

type Headers = {
  level: number;
  children: ReactNode;
};

const Headers = ({ level, children }: Headers) => {
  return (
    <>
      {(() => {
        switch (level) {
          case 1:
            return <StyledH1>{children}</StyledH1>;
          case 2:
            return <StyledH2>{children}</StyledH2>;
          case 3:
            return <StyledH3>{children}</StyledH3>;
          case 4:
            return <h4>{children}</h4>;
          default:
            return null;
        }
      })()}
    </>
  );
};

//  --- Styling ---
//  Logo - H1 appears in this project only once in the Navbar component
const StyledH1 = styled.h1`
  align-self: center;
  min-width: 250px;
  color: rgba(255, 255, 255, 0.9);
  text-shadow: 0px 0px 3px black;
  font-size: 26px;
  letter-spacing: 2px;

  > span {
    color: rgb(255, 213, 0);
  }

  @media (max-width: 1000px) {
    width: 100%;
    text-align: center;
  }
`;

const StyledH2 = styled.h2`
  flex-basis: 100%;
  color: rgb(0, 0, 0);
  padding: 35px 0;
  font-family: "Exo 2", sans-serif;
`;

const StyledH3 = styled.h3`
  /* width: 80%; */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export default Headers;
