import React, { Fragment, useEffect, useState } from 'react';
import Modal from '../../components/UI/Modal/Modal';

const withErrorHandler = (WrappedComponent, axios) => {
  return props => {
    const [error, setError] = useState(null);

    const reqIntercepter = axios.interceptors.request.use(req => {
      setError(null);
      return req;
    });

    const resIntercepter = axios.interceptors.response.use(
      res => res,
      error => {
        setError(error);
      }
    );

    useEffect(() => {
      return () => {
        axios.interceptors.request.eject(reqIntercepter);
        axios.interceptors.response.eject(resIntercepter);
      };
    }, [reqIntercepter, resIntercepter]);

    const errorConfirmedHandler = () => {
      setError(null);
    };

    return (
      <Fragment>
        <Modal show={error} modalClosed={errorConfirmedHandler}>
          {error ? error.message : null}
        </Modal>
        <WrappedComponent {...props} />
      </Fragment>
    );
  };
};

export default withErrorHandler;
