import React, {Component} from 'react';
import styles from './table.module.css'; //Загрузка "переменной" стилей из файла table.module.css
import Navbar from './Navbar'; //Загрузка компонента Navbar из файла Navbar.js

class ForBuyer extends Component { 

    date() { //ф-ция, которая возвращает текущие дату и время
        let getCurrentDate = (curr = new Date()) =>
            ([curr.getFullYear(),
                    curr.getMonth(),
                    curr.getDate()].join('-')
                + " " + [curr.getHours(), curr.getMinutes()].join(':'));
        return getCurrentDate();
    };
    /*
    Вместе с компонентой Navbar отрисовываем на странице следующие объекты:
    Надпись "AVAILABLE PRODUCTS"
    Таблицу, содержащую следующие столбцы: ID, Date, Name, Price, Owner, ACTION
    Заполняем таблицу из переданных props (данные, которые передаются между объектами)
    В столбец ACTION добавляется кнопка BUY, за именем и значением которой закрепляются ID и PRICE продукта
    По нажатию на кнопку BUY вызывается функция из переданных props по покупке продуктов (purchaseProduct)
    */
    render() {
        return (
            <div className={styles.fontBody}>
                <Navbar/>
                <h2>AVAILABLE PRODUCTS</h2>
                <table className="table">
                    <thead>
                    <tr className={styles.tableHeader}>
                        <th className={styles.column1}>ID</th>
                        <th className={styles.column2}>Date</th>
                        <th className={styles.column3}>Name</th>
                        <th className={styles.column4}>Price</th>
                        <th className={styles.column5}>Owner</th>
                        <th className={styles.column6}>ACTION</th>
                    </tr>
                    </thead>
                    <tbody id="productList">
                    {this.props.products.filter(product => !product.purchased).map((product, key) => {
                        return (
                            <tr key={key}>
                                <th className={styles.column1}>{product.id.toString()}</th>
                                <td className={styles.column2}>{this.date()}</td>
                                <td className={styles.column3}>{product.name}</td>
                                <td className={styles.column4}>{window.web3.utils.fromWei(product.price.toString(), 'Ether')} Eth</td>
                                <td className={styles.column5}>{product.owner}</td>
                                <td className={styles.column6}>
                                    {<button
                                        name={product.id}
                                        value={product.price}
                                        onClick={(event) => {
                                            this.props.purchaseProduct(event.target.name, event.target.value)
                                        }}
                                    >
                                        Buy
                                    </button>
                                    }
                                </td>

                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default ForBuyer;