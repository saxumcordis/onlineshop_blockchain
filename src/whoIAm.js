import React, { Component } from 'react';
import styles from './table.module.css';
import {useUserContext} from './UserContext';
import {useCallback} from 'react'

  const WhoIAm = () => {
  	const {setUser} = useUserContext(); // установим связь с контекстом
　	const setSeller = useCallback(() => setUser('seller'), [setUser]); //ф-ция устанавливает 'seller' в контекте setUser
　	const setBuyer = useCallback(() => setUser('buyer'), [setUser]); //ф-ция устанавливает 'buyer' в контекте setUser
    return (
      //Возвращаем контейнер с надписью WHO AM I и две кнопки:
      // первая переводит контекст в продавца, вторая переводит контекст в покупателя
      <div className={styles.helloDiv}>
        <h1 className={styles.whoIAm}> WHO AM I?</h1>
        <div className={styles.button}><button onClick={setSeller}><p className={styles.buttonText}>Seller</p></button></div>
        <div className={styles.button}><button onClick={setBuyer}><p className={styles.buttonText}>Buyer</p></button></div>
      </div>
    );
  }

export default WhoIAm;