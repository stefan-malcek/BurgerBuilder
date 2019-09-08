import React, { Fragment, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import axios from '../../axios-orders';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Burger from '../../components/Burger/Burger';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Modal from '../../components/UI/Modal/Modal';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/WithErrorHandler/WithErrorHandler';
import * as actions from '../../store/actions/index';

function BurgerBuilder(props) {
  const [purchasing, setPurchasing] = useState(false);
  useEffect(() => {
    props.onInitIngredients();
  }, []);

  const isPurchasable = ingredients =>
    Object.values(ingredients).reduce((a, b) => a + b, 0) > 0;

  const purchaseHandler = () => {
    if (props.isAuthenticated) {
      setPurchasing(true);
    } else {
      props.onSetAuthRedirectPath('/checkout');
      props.history.push('/auth');
    }
  };

  const purchaseCancelHandler = () => {
    setPurchasing(false);
  };

  const purchaseContinueHandler = () => {
    props.onInitPurchase();
    props.history.push('/checkout');
  };

  let orderSummary = null;
  let burger = props.error ? <p>Ingredients can't be loaded</p> : <Spinner />;
  if (props.ings) {
    const disabledInfo = Object.entries(props.ings).reduce(
      (accum, [key, count]) => {
        accum[key] = count <= 0;
        return accum;
      },
      {}
    );

    burger = (
      <Fragment>
        <Burger ingredients={props.ings} />
        <BuildControls
          ingredientAdded={props.onIngredientAdded}
          ingredientRemoved={props.onIngredientRemove}
          disabled={disabledInfo}
          price={props.price}
          purchasable={!isPurchasable(props.ings)}
          isAuth={props.isAuthenticated}
          ordered={purchaseHandler}
        />
      </Fragment>
    );
    orderSummary = (
      <OrderSummary
        ingredients={props.ings}
        price={props.price}
        purchaseCanceled={purchaseCancelHandler}
        purchaseContinued={purchaseContinueHandler}
      ></OrderSummary>
    );
  }

  return (
    <Fragment>
      <Modal show={purchasing} modalClosed={purchaseCancelHandler}>
        {orderSummary}
      </Modal>
      {burger}
    </Fragment>
  );
}
const mapStateToProps = state => {
  return {
    ings: state.burgerBuilder.ingredients,
    price: state.burgerBuilder.totalPrice,
    error: state.burgerBuilder.error,
    isAuthenticated: state.auth.token !== null
  };
};
const mapDispatchToProps = dispatch => {
  return {
    onIngredientAdded: name => dispatch(actions.addIngredient(name)),
    onIngredientRemove: name => dispatch(actions.removeIngredient(name)),
    onInitIngredients: () => dispatch(actions.initIngredients()),
    onInitPurchase: () => dispatch(actions.purchaseInit()),
    onSetAuthRedirectPath: path => dispatch(actions.setAuthRedirectPath(path))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(BurgerBuilder, axios));
