import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Nav from './UI/Nav';
import Button from './UI/Button';

const Navbar = () => {
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
                        Login
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
