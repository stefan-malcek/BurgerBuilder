import React, { Fragment, Component } from 'react';
import Button from '../../UI/Button/Button';

class OrderSummary extends Component {
  // Can be a functional component.
  componentDidUpdate() {
    console.log('[OrderSummary] did update.');
  }

  render() {
    const ingredientSummary = Object.entries(this.props.ingredients).map(
      ([key, value]) => (
        <li key={key}>
          <span style={{ textTransform: 'capitalize' }}>{key}</span>: {value}
        </li>
      )
    );

    return (
      <Fragment>
        <h3>Your Order</h3>
        <p>A delicious burger with the following ingredients:</p>
        <ul>{ingredientSummary}</ul>
        <p>
          <strong>Total Price: {this.props.price.toFixed(2)}</strong>
        </p>
        <p>Continue to Checkout?</p>
        <Button btnType="Danger" clicked={this.props.purchaseCanceled}>
          CANCEL
        </Button>
        <Button btnType="Success" clicked={this.props.purchaseContinued}>
          CONTINUE
        </Button>
      </Fragment>
    );
  }
}

export default OrderSummary;
