import { type ReactNode } from 'react';


type ScreenProps = {
    children: ReactNode;
};

const Screen = ({ children }: ScreenProps) => {

    return <ScreenContainer>{children}</ScreenContainer>
};

//  --- Styling ---
import styled from 'styled-components';

const ScreenContainer = styled.section`
    flex-basis: 70%;
    padding: 50px 70px;
    min-height: 450px;

    > * {
        display: block;
    }
`;

export default Screen;
