import React, { Component, Fragment } from 'react';
import Backdrop from '../Backdrop/Backdrop';
import classes from './Modal.module.css';

function Modal(props) {
  // shouldComponentUpdate(nextProps, nextState) {
  //   return (
  //     nextProps.show !== props.show ||
  //     nextProps.children !== props.children
  //   );
  // }

  return (
    <Fragment>
      <Backdrop show={props.show} clicked={props.modalClosed} />
      <div
        className={classes.Modal}
        style={{
          transform: props.show ? 'translateY(0)' : 'translateY(-100vh)',
          opacity: props.show ? '1' : '0'
        }}
      >
        {props.children}
      </div>
    </Fragment>
  );
}

export default React.memo(
  Modal,
  (prevProps, nextProps) =>
    nextProps.show === prevProps.show &&
    nextProps.children === prevProps.children
);
