import React, {Component} from 'react'; // загрузка зависимостей 
import Web3 from 'web3' // Загрузка библиотеки web3
import OnlineShop from './abis/OnlineShop.json' //Загрузка скомпилированного контракта Solidity
import WhoIAm from './whoIAm'; //Загрузка компонента WhoIAm
import ForSeller from './forSeller'; //Загрузка компонента 
import ForBuyer from './forBuyer'; //Загрузка компонента
import styles from './table.module.css'; //Загрузка "переменной" стилей из файла table.module.css
import {UserProvider} from './UserContext'; 
import {useUserContext} from './UserContext';
import {UserContext} from './UserContext';
import {useCallback} from 'react'

class App extends Component { // Создание компонента домашней страницы
    /*
      async -- эта функция, которая всегда возвращает промис
      промис -- асинхронное задание, которое должно завершиться
      await используется только внутри async ф-ций
      Код может остановиться, чтобы подождать, пока завершится await ф-ция
      await возвращает то, что асинхронная ф-ция возвращает при завершении
      await также заставит ждать, чтобы ф-ция справа выполнилась, только потом продолжится основной блок-кода
    */
    async componentDidMount() { // Метод, который вызывается сразу после монтирования (Вставки компонента в DOM)
        await this.loadWeb3() //вызов ф-ции loadWeb3
        await this.loadBlockchainData() //вызов ф-ции loadBlockchainData
    }

    async loadWeb3() { // Ф-ция подключения к сети Ethereum (Metamask)
      /*
      Ф-ция проверяет наличие "проводника" к Ethereum в веб-браузере
      и позволяет подключить наше приложение к блокчейну.
      Если же браузер не поддерживает подключение к MetaMask, то будет выведено предупреждение
      */
        if (window.ethereum) { //Запрашиваем разрешение к использованию MetaMask, если браузер является "ethereum-browser"
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable() 
        } else if (window.web3) { // То же самое, но для устаревший браузеров
            window.web3 = new Web3(window.web3.currentProvider)
        } else { //если браузер не является "Ethereum-browser", вывести окно с надписью
            window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
    }

    async loadBlockchainData() { //Ф-ция загрузки данных из блокчейна
        const web3 = window.web3 // переменная, которая будет связующей с блокчейном
        const accounts = await web3.eth.getAccounts() // загружаем аккаунты Metamask
        this.setState({account: accounts[0]}) // задаём используемый аккаунт. (Тот, который выбран текущим в MetaMask)
        const networkId = await web3.eth.net.getId() //Получаем ID сети нашего блокчейна 
        const networkData = OnlineShop.networks[networkId] //Получаем даныне сединения с нашим блокчейном (В файле OnlineShop.json -> network[ID])
        if (networkData) { // Если это подключение корректно (нашего приложения и нашего блокчейна через Metamask, то ОК)
            const onlineshop = web3.eth.Contract(OnlineShop.abi, networkData.address) // Загружаем контракт в переменную 
            this.setState({onlineshop}) // Устанавливаем наследование текущего компонента (App) с onlineshop
            const productCount = await onlineshop.methods.productCount().call() // достаём количество продуктов
            this.setState({productCount}) // добавляем к наследованию кол-во продуктов
            for (let i = 1; i <= productCount; i++) { // заполняем массив продуктов 
                const product = await onlineshop.methods.products(i).call() 
                this.setState({ //добавляем к наследованию
                    products: [...this.state.products, product]
                })
            }
            this.setState({loading: false}) // устанавливаем состояние загрузки как ложное, тк загрузка завершена
        } else { // если сети (адреса) не существует, вывести предупреждение
            window.alert('OnlineShop contract not deployed to detected network.')
        }
    }

    constructor(props) { // Конструктор класса, который задаёт свойства
        super(props) // Закрепляет наследование между свойствами и классом
        this.state = {
            account: '',
            productCount: 0,
            products: [],
            loading: true,
        }

        this.createProduct = this.createProduct.bind(this) // закрепим ф-цию с жёсткой привязкой контекста
        this.purchaseProduct = this.purchaseProduct.bind(this)
    }

    createProduct(name, price) { // ф-ция создания продукта
        this.setState({loading: true}) // "переводим" компонент в режим ожидания
        this.state.onlineshop.methods.createProduct(name, price).send({from: this.state.account}) // выполняем метод контракта и отправляем его в блокчейн
            .once('receipt', (receipt) => { // после ответа завершить режим ожидания
                this.setState({loading: false})
            })
    }

    purchaseProduct(id, price) { //ф-ция покупки продукта. Аналогично ф-ции выше
        this.setState({loading: true})
        this.state.onlineshop.methods.purchaseProduct(id).send({from: this.state.account, value: price})
            .once('receipt', (receipt) => {
                this.setState({loading: false})
            })
    }

/*
Если продавец:
загружаем фоновый контейнер (с градиентом), затем в зависимости от состояния (режим ожидания или нет):
Рисуем или кнопку "ПЕРЕЗАГРУЗИТЬ", или запускается сценарий, который рисует страницу для покупателя (файл forSeller.js)
Если покупатель:
загружаем фоновый контейнер (с градиентом), затем в зависимости от состояния (режим ожидания или нет):
Рисуем или кнопку "ПЕРЕЗАГРУЗИТЬ", или запускается сценарий, который рисует страницу для продавца (файл forBuyer.js)
Если пользователь не определился, то запускается сценарий, который рисует страницу для "выбора роли" (файл whoIAm.js)
*/
    render() { //render -- обязательный метод класса(Компонента) который отвечает за прорисовку страницы

        return (
            <UserContext.Consumer>{({user}) => ( //Объявим контекст, который работает с тем, что определяет, кто сейчас на странице (Покупатель, продавец)
                user == "seller" ? // если продавец:
                    <div className={styles.fontBody}>
                        <div>
                                    {this.state.loading //смотрим, какое состояние сейчас (режим ожидания или нет)
                                        ? <button className={styles.button} onClick={(event) => {
                                            window.location.reload(); //при нажатии на кнопку REFRESH перезагрузить страницу
                                        }}><p className={styles.buttonText}>REFRESH</p></button>
                                        : //запуск сценария из файла forSeller.js
                                         <ForSeller
                                            products={this.state.products}
                                            createProduct={this.createProduct}/>
                                    }
                        </div>
                    </div>
                    : user == "buyer" ? // если покупатель:
                    <div className={styles.fontBody}>
                        <div>
                                    {this.state.loading //смотрим, какое состояние сейчас (режим ожидания или нет)
                                        ? <button className={styles.button} onClick={(event) => {
                                            window.location.reload(); //при нажатии на кнопку REFRESH перезагрузить страницу
                                        }}><p className={styles.buttonText}>REFRESH</p></button>
                                        : //запуск сценария из файла forBuyer.js 
                                        <ForBuyer
                                            products={this.state.products}
                                            purchaseProduct={this.purchaseProduct}/>
                                    }
                        </div>
                    </div>
                    : // если нет "роли" запуск сценария из файла whoIAm.js
                    <div className={styles.fontBody}>
                        <WhoIAm/>
                    </div>
            )}</UserContext.Consumer>
        );
    }
}

export default App;