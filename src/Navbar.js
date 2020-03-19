import React from 'react';
import styles from './table.module.css';
import {useUserContext} from './UserContext';
import {useCallback} from 'react'


const Navbar = () => {
    const {setUser} = useUserContext();
    const unsetUser = useCallback(() => setUser('none'), [setUser]);
    return (
        <div className={styles.navbar}>
            <h1 className={styles.h1}>WELCOME TO THE ONLINE SHOP</h1>
            <button onClick={unsetUser}><h3>RETURN BACK</h3></button>
        </div>
    );
};

export default Navbar;