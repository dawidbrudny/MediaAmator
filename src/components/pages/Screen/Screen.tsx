import { type ReactNode } from "react";

type ScreenProps = {
  children: ReactNode;
};

const Screen = ({ children }: ScreenProps) => {
  return <ScreenContainer>{children}</ScreenContainer>;
};

//  --- Styling ---
import styled from "styled-components";

const ScreenContainer = styled.section`
  width: 70%;
  padding: 50px;
  min-height: 450px;
  min-width: 300px;

  > * {
    display: block;
  }

  @media (max-width: 1200px) {
    width: 70%;
  }
`;

export default Screen;
