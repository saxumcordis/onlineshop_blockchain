import React, {Component} from 'react';

import Web3 from 'web3'
import './App.css';
import OnlineShop from './abis/OnlineShop.json'
import WhoIAm from './whoIAm';
import ForSeller from './forSeller';
import ForBuyer from './forBuyer';
import styles from './table.module.css';
import {UserProvider} from './UserContext';
import {useUserContext} from './UserContext';
import {UserContext} from './UserContext';
import {useCallback} from 'react'

class App extends Component {

    async componentWillMount() {
        await this.loadWeb3()
        await this.loadBlockchainData()
    }

    async loadWeb3() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum)
            await window.ethereum.enable()
        } else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider)
        } else {
            window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
    }

    async loadBlockchainData() {
        const web3 = window.web3
        // Load account
        const accounts = await web3.eth.getAccounts()
        this.setState({account: accounts[0]})
        const networkId = await web3.eth.net.getId()
        const networkData = OnlineShop.networks[networkId]
        if (networkData) {
            const onlineshop = web3.eth.Contract(OnlineShop.abi, networkData.address)
            this.setState({onlineshop})
            const productCount = await onlineshop.methods.productCount().call()
            this.setState({productCount})
            // Load products
            for (var i = 1; i <= productCount; i++) {
                const product = await onlineshop.methods.products(i).call()
                this.setState({
                    products: [...this.state.products, product]
                })
            }
            this.setState({loading: false})
        } else {
            window.alert('OnlineShop contract not deployed to detected network.')
        }
    }

    constructor(props) {
        super(props)
        this.state = {
            account: '',
            productCount: 0,
            products: [],
            loading: true,
            whoIAm: "none"
        }

        this.createProduct = this.createProduct.bind(this)
        this.purchaseProduct = this.purchaseProduct.bind(this)
    }

    createProduct(name, price) {
        this.setState({loading: true})
        this.state.onlineshop.methods.createProduct(name, price).send({from: this.state.account})
            .once('receipt', (receipt) => {
                this.setState({loading: false})
            })
    }

    purchaseProduct(id, price) {
        this.setState({loading: true})
        this.state.onlineshop.methods.purchaseProduct(id).send({from: this.state.account, value: price})
            .once('receipt', (receipt) => {
                this.setState({loading: false})
            })
    }

    render() {

        return (
            <UserContext.Consumer>{({user}) => (
                user == "seller" ?
                    <div className={styles.fontBody}>
                        <div>
                            <div className="row">
                                <main role="main">
                                    {this.state.loading
                                        ? <button className={styles.button} onClick={(event) => {
                                            window.location.reload();
                                        }}><p className={styles.buttonText}>REFRESH</p></button>
                                        : <ForSeller
                                            products={this.state.products}
                                            createProduct={this.createProduct}/>
                                    }
                                </main>
                            </div>
                        </div>
                    </div>
                    : user == "buyer" ?
                    <div className={styles.fontBody}>
                        <div>
                            <div className="row">
                                <main role="main">
                                    {this.state.loading
                                        ? <button className={styles.button} onClick={(event) => {
                                            window.location.reload();
                                        }}><p className={styles.buttonText}>REFRESH</p></button>
                                        : <ForBuyer
                                            products={this.state.products}
                                            purchaseProduct={this.purchaseProduct}/>
                                    }
                                </main>
                            </div>
                        </div>
                    </div>
                    :
                    <div className={styles.fontBody}>
                        <WhoIAm/>
                    </div>
            )}</UserContext.Consumer>
        );
    }
}

export default App;