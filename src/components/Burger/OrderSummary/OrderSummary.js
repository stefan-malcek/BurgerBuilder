import React, { Fragment } from 'react';
import Button from '../../UI/Button/Button';

function OrderSummary(props) {
  const ingredientSummary = Object.entries(props.ingredients).map(
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
        <strong>Total Price: {props.price.toFixed(2)}</strong>
      </p>
      <p>Continue to Checkout?</p>
      <Button btnType="Danger" clicked={props.purchaseCanceled}>
        CANCEL
      </Button>
      <Button btnType="Success" clicked={props.purchaseContinued}>
        CONTINUE
      </Button>
    </Fragment>
  );
}

export default OrderSummary;
