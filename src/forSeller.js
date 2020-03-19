import React, {Component} from 'react';
import styles from './table.module.css';
import Navbar from './Navbar';

class ForSeller extends Component {

    render() {
        return (
            <div className={styles.helloDiv}>
                <Navbar/>
                <p className={styles.buttonText}><strong>Add Product</strong></p>

                <form onSubmit={(event) => {
                    event.preventDefault()
                    const name = this.productName.value
                    const price = window.web3.utils.toWei(this.productPrice.value.toString(), 'Ether')
                    this.props.createProduct(name, price)
                }}>
                    <div>
                        <input
                            id="productName"
                            type="text"
                            ref={(input) => {
                                this.productName = input
                            }}
                            className="formControl"
                            placeholder="Product Name"
                            required/>
                    </div>
                    <div>
                        <input
                            id="productPrice"
                            type="text"
                            ref={(input) => {
                                this.productPrice = input
                            }}
                            className="form-control"
                            placeholder="Product Price"
                            required/>
                    </div>
                    <button type="submit"><p className={styles.buttonText}>SUBMIT</p></button>
                </form>
            </div>
        );
    }
}

export default ForSeller;