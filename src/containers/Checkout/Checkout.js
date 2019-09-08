import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Route, withRouter } from 'react-router-dom';
import CheckoutSummary from '../../components/Order/CheckoutSummary/CheckoutSummary';
import ContactData from './ContactData/ContactData';

function Checkout(props) {
  const checkoutChancelledHandler = () => {
    props.history.goBack();
  };

  const checkoutContinuedHandler = () => {
    props.history.replace('checkout/contact-data');
  };

  let summary = <Redirect to="/" />;
  if (props.ings) {
    const purchasedRedirect = props.purchased ? <Redirect to="/" /> : null;

    summary = (
      <div>
        {purchasedRedirect}
        <CheckoutSummary
          ingredients={props.ings}
          checkoutChancelled={checkoutChancelledHandler}
          checkoutContinued={checkoutContinuedHandler}
        />
        <Route
          path={props.match.url + '/contact-data'}
          component={ContactData}
        />
      </div>
    );
  }

  return summary;
}

const mapStateToProps = state => {
  return {
    ings: state.burgerBuilder.ingredients,
    purchased: state.order.purchased
  };
};

export default connect(mapStateToProps)(withRouter(Checkout));
