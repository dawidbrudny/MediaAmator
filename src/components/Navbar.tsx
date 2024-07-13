import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useLoginSelector } from '../redux/hooks';

import Nav from './UI/Nav';
import Button from './UI/Button';

const Navbar = () => {
    const login = useLoginSelector(state => state.login.isLoggedIn);

    return (
        <Nav className='navbar'>
            <div className="container">
                <h1 className='Logo'><span>Media<FontAwesomeIcon icon='arrows-left-right-to-line' /></span>Amator</h1>
                <section className='navbar-buttons'>
                    <Button 
                    className='
                    button 
                    button-navbar 
                    login'
                    link='/login'
                    >
                        {login ? 'Konto' : 'Login'}
                    </Button>
                    <Button className='
                    button 
                    button-navbar 
                    shopping-cart'
                    >
                        <FontAwesomeIcon icon='shopping-cart' /><span>: 4</span>
                    </Button>
                </section>
            </div>
        </Nav>
    );
};

export default Navbar;
