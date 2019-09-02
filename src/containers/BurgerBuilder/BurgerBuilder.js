import React, { Component, Fragment } from 'react';
import axios from '../../axios-orders';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Burger from '../../components/Burger/Burger';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Modal from '../../components/UI/Modal/Modal';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/WithErrorHandler/WithErrorHandler';

const INGREDIENT_PRICES = {
  salad: 0.5,
  cheese: 0.4,
  meat: 1.3,
  bacon: 0.7
};

class BurgerBuilder extends Component {
  state = {
    ingredients: null,
    totalPrice: 4,
    purchasable: false,
    purchasing: false,
    isLoading: false,
    error: null
  };

  updatePurchasableState = ingredients => {
    const sum = Object.values(ingredients).reduce((a, b) => a + b, 0);
    this.setState({ purchasable: sum > 0 });
  };

  addIngredientHandler = type => {
    const updatedIngredients = { ...this.state.ingredients };
    const oldCount = this.state.ingredients[type];
    updatedIngredients[type] = oldCount + 1;

    const newPrice = this.state.totalPrice + INGREDIENT_PRICES[type];
    this.setState({ totalPrice: newPrice, ingredients: updatedIngredients });
    this.updatePurchasableState(updatedIngredients);
  };

  removeIngredientHandler = type => {
    const updatedIngredients = { ...this.state.ingredients };
    const oldCount = this.state.ingredients[type];

    if (oldCount <= 0) {
      return;
    }

    updatedIngredients[type] = oldCount - 1;

    const newPrice = this.state.totalPrice - INGREDIENT_PRICES[type];
    this.setState({ totalPrice: newPrice, ingredients: updatedIngredients });
    this.updatePurchasableState(updatedIngredients);
  };

  purchaseHandler = () => {
    this.setState({ purchasing: true });
  };

  purchaseCancelHandler = () => {
    this.setState({ purchasing: false });
  };

  purchaseContinueHandler = () => {
    this.setState({ isLoading: true });

    const order = {
      ingredients: this.state.ingredients,
      price: this.state.totalPrice,
      customer: {
        name: 'Had',
        address: {
          street: 'Test 1',
          zipCode: '12345',
          coutry: 'Anywhere'
        },
        email: 'test@test.com'
      },
      deliveryMethod: 'fastest'
    };
    axios
      .post('/orders.json', order)
      .then(response => {
        console.log(response);
        this.setState({ isLoading: false, purchasing: false });
      })
      .catch(error => {
        console.log(error);
        this.setState({ isLoading: false, purchasing: false });
      });
  };

  componentDidMount() {
    axios
      .get('https://burgerbuilder-6485d.firebaseio.com/ingredients.json')
      .then(response => {
        this.setState({ ingredients: response.data });
      })
      .catch(() => {
        this.setState({ error: true });
      });
  }

  render() {
    let orderSummary = null;
    let burger = this.state.error ? (
      <p>Ingredients can't be loaded</p>
    ) : (
      <Spinner />
    );
    if (this.state.ingredients) {
      const disabledInfo = Object.entries(this.state.ingredients).reduce(
        (accum, [key, count]) => ((accum[key] = count <= 0), accum),
        {}
      );

      burger = (
        <Fragment>
          <Burger ingredients={this.state.ingredients} />
          <BuildControls
            ingredientAdded={this.addIngredientHandler}
            ingredientRemoved={this.removeIngredientHandler}
            disabled={disabledInfo}
            price={this.state.totalPrice}
            purchasable={!this.state.purchasable}
            ordered={this.purchaseHandler}
          />
        </Fragment>
      );
      orderSummary = (
        <OrderSummary
          ingredients={this.state.ingredients}
          price={this.state.totalPrice}
          purchaseCanceled={this.purchaseCancelHandler}
          purchaseContinued={this.purchaseContinueHandler}
        ></OrderSummary>
      );
    }

    if (this.state.isLoading) {
      orderSummary = <Spinner />;
    }

    return (
      <Fragment>
        <Modal
          show={this.state.purchasing}
          modalClosed={this.purchaseCancelHandler}
        >
          {orderSummary}
        </Modal>
        {burger}
      </Fragment>
    );
  }
}

export default withErrorHandler(BurgerBuilder, axios);
