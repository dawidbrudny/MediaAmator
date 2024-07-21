import { type ReactNode } from 'react';
import styled from 'styled-components';

type MainProps = {
    children?: ReactNode;
};

const Main = ({ children }: MainProps) => {
    return <Container>{children}</Container>
};

//  --- Styling ---
const Container = styled.main`
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    width: 70%;
    max-width: 1440px;
    text-align: center;
    margin: 80px auto;
`;

export default Main;
