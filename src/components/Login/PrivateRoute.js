import React from "react";
import { connect } from 'react-redux';
import { Redirect, Route } from "react-router-dom";

//eslint-disable-line
const PrivateRoute = ({ component: Component, isAuthenticated, ...props }) => (
    <Route
        {...props}
        render={(props) => {
            if (!isAuthenticated) {
                return (
                    <Redirect
                        to={{
                            pathname: "/",
                        }}
                    />
                );
            }
            return <Component {...props} />;
        }}
    />
);

const mapStateToProps = (state) => {
    return {
        isAuthenticated: state.auth.token !== null,
    };
};

export default connect(mapStateToProps, null)(PrivateRoute);
