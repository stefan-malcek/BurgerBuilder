import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
  const dispatch = useDispatch();

  const ings = useSelector(state => state.burgerBuilder.ingredients);
  const price = useSelector(state => state.burgerBuilder.totalPrice);
  const error = useSelector(state => state.burgerBuilder.error);
  const isAuthenticated = useSelector(state => state.auth.token !== null);

  const onInitIngredients = useCallback(
    () => dispatch(actions.initIngredients()),
    [dispatch]
  );
  const onIngredientAdded = name => dispatch(actions.addIngredient(name));
  const onIngredientRemove = name => dispatch(actions.removeIngredient(name));
  const onInitPurchase = () => dispatch(actions.purchaseInit());
  const onSetAuthRedirectPath = path =>
    dispatch(actions.setAuthRedirectPath(path));

  useEffect(() => {
    onInitIngredients();
  }, [onInitIngredients]);

  const isPurchasable = ingredients =>
    Object.values(ingredients).reduce((a, b) => a + b, 0) > 0;

  const purchaseHandler = () => {
    if (isAuthenticated) {
      setPurchasing(true);
    } else {
      onSetAuthRedirectPath('/checkout');
      props.history.push('/auth');
    }
  };

  const purchaseCancelHandler = () => {
    setPurchasing(false);
  };

  const purchaseContinueHandler = () => {
    onInitPurchase();
    props.history.push('/checkout');
  };

  let orderSummary = null;
  let burger = error ? <p>Ingredients can't be loaded</p> : <Spinner />;
  if (ings) {
    const disabledInfo = Object.entries(ings).reduce((accum, [key, count]) => {
      accum[key] = count <= 0;
      return accum;
    }, {});

    burger = (
      <Fragment>
        <Burger ingredients={ings} />
        <BuildControls
          ingredientAdded={onIngredientAdded}
          ingredientRemoved={onIngredientRemove}
          disabled={disabledInfo}
          price={price}
          purchasable={!isPurchasable(ings)}
          isAuth={isAuthenticated}
          ordered={purchaseHandler}
        />
      </Fragment>
    );
    orderSummary = (
      <OrderSummary
        ingredients={ings}
        price={price}
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

export default withErrorHandler(BurgerBuilder, axios);
