import { FC } from 'react';

import Nav from './UI/Nav';
import Button from './UI/Button';

const Navbar: FC = () => {
    return (
        <Nav className='navbar'>
            <span className='Logo'>Lista zakupów</span>
            <Button className='button button-login'>Login</Button>
        </Nav>
    );
};

export default Navbar;
