import React from 'react';

import classes from './Order.module.css';

const order = props => {
  const ingredientOutput = Object.entries(props.ingredients).map(
    ([key, val]) => {
      return (
        <span
          style={{
            textTransform: 'capitalize',
            display: 'inline-block',
            margin: '0 8px',
            border: '1px solid #ccc',
            padding: '5px'
          }}
          key={key}
        >
          {key} ({val})
        </span>
      );
    }
  );

  return (
    <div className={classes.Order}>
      <p>Ingredients: {ingredientOutput}</p>
      <p>
        Price: <strong>USD {Number.parseFloat(props.price).toFixed(2)}</strong>
      </p>
    </div>
  );
};

export default order;
