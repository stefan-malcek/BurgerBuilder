import React, { useState } from 'react';
import { connect } from 'react-redux';
import axios from '../../../axios-orders';
import Button from '../../../components/UI/Button/Button';
import Input from '../../../components/UI/Input/Input';
import Spinner from '../../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../../hoc/WithErrorHandler/WithErrorHandler';
import { checkValidity, updateObject } from '../../../shared/utility';
import * as actions from '../../../store/actions/index';
import classes from './ContactData.module.css';

function ContactData(props) {
  const [orderForm, setOrderForm] = useState({
    name: {
      elementType: 'input',
      elementConfig: {
        type: 'text',
        placeholder: 'Your Name'
      },
      value: '',
      validation: {
        required: true
      },
      valid: false,
      touched: false
    },
    street: {
      elementType: 'input',
      elementConfig: {
        type: 'text',
        placeholder: 'Street'
      },
      value: '',
      validation: {
        required: true
      },
      valid: false,
      touched: false
    },
    zipCode: {
      elementType: 'input',
      elementConfig: {
        type: 'text',
        placeholder: 'Zip Code'
      },
      value: '',
      validation: {
        required: true,
        minLength: 5,
        maxLength: 5
      },
      valid: false,
      touched: false
    },
    coutry: {
      elementType: 'input',
      elementConfig: {
        type: 'text',
        placeholder: 'Country'
      },
      value: '',
      validation: {
        required: true
      },
      valid: false,
      touched: false
    },
    email: {
      elementType: 'input',
      elementConfig: {
        type: 'email',
        placeholder: 'Your Email'
      },
      value: '',
      validation: {
        required: true
      },
      valid: false,
      touched: false
    },
    deliveryMethod: {
      elementType: 'select',
      elementConfig: {
        options: [
          { value: 'fastest', displayName: 'Fastest' },
          { value: 'cheapest', displayName: 'Cheapest' }
        ]
      },
      value: 'fastest',
      valid: true
    }
  });
  const [formIsValid, setFormIsValid] = useState(false);

  const orderHandler = event => {
    event.preventDefault();

    const formData = Object.entries(orderForm).reduce((accum, [key, value]) => {
      accum[key] = value.value;
      return accum;
    }, {});
    const order = {
      ingredients: props.ings,
      price: props.price,
      orderData: formData,
      userId: props.userId
    };

    props.onOrderBurger(order, props.token);
  };

  const inputChangedHandler = (event, inputId) => {
    const updatedFormElement = updateObject(orderForm[inputId], {
      value: event.target.value,
      valid: checkValidity(event.target.value, orderForm[inputId].validation),
      touched: true
    });

    const updatedOrderForm = updateObject(orderForm, {
      [inputId]: updatedFormElement
    });

    let formIsValid = Object.entries(updatedOrderForm).reduce(
      (accum, [_, control]) => {
        return accum && control.valid;
      },
      true
    );
    setOrderForm(updatedOrderForm);
    setFormIsValid(formIsValid);
  };

  let form = (
    <form onSubmit={orderHandler}>
      {Object.entries(orderForm).map(([key, value]) => {
        return (
          <Input
            key={key}
            elementType={value.elementType}
            elementConfig={value.elementConfig}
            value={value.value}
            invalid={!value.valid}
            touched={value.touched}
            shouldValidate={value.validation}
            changed={event => inputChangedHandler(event, key)}
          />
        );
      })}

      <Button btnType="Success" disabled={!formIsValid}>
        ORDER
      </Button>
    </form>
  );
  if (props.loading) {
    form = <Spinner />;
  }

  return (
    <div className={classes.ContactData}>
      <h4>Enter your Contact Data</h4>
      {form}
    </div>
  );
}

const mapStateToProps = state => {
  return {
    ings: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    loading: state.order.loading,
    token: state.auth.token,
    userId: state.auth.userId
  };
};

const dispatchToProps = dispatch => {
  return {
    onOrderBurger: (orderData, token) =>
      dispatch(actions.purchaseBurger(orderData, token))
  };
};

export default connect(
  mapStateToProps,
  dispatchToProps
)(withErrorHandler(ContactData, axios));
