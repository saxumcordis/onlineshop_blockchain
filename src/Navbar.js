import React from 'react';
import styles from './table.module.css';
import {useUserContext} from './UserContext';
import {useCallback} from 'react'


const Navbar = () => {
    const {setUser} = useUserContext(); // установим связь с контекстом
    const unsetUser = useCallback(() => setUser(null), [setUser]); //создадим ф-цию, которая обраащется к контексту по установленной связи
    // и меняет state на указанный (в нашем случае 'null')
    return ( //возвращаем контейнер, который содержит надпись приветствия и кнопку, нажатие которой переводит контекст к null
        <div className={styles.navbar}>
            <h1 className={styles.h1}>WELCOME TO THE ONLINE SHOP</h1>
            <button onClick={unsetUser}><h3>RETURN BACK</h3></button>
        </div>
    );
};

export default Navbar;