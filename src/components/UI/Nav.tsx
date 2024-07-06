import { 
    type FC,
    type ReactNode,
    type ComponentPropsWithoutRef,
} from 'react';

type NavProps = ComponentPropsWithoutRef<'nav'> & {
    children: ReactNode;
};

const Nav: FC<NavProps> = ({ children, ...props }) => {

    return (
        <nav {...props}>
            {children}
        </nav>
    );
};

export default Nav;
