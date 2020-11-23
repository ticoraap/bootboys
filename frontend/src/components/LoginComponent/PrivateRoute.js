import React from "react";
import {authenticationService} from "./authentication.service";
import {Redirect, Route} from 'react-router-dom';


export const PrivateRoute = ({component: Component, ...rest}) => ( //eslint-disable-line
    <Route {...rest} render={
        props => {
            const currentUser = authenticationService.currentUserValue;
            if (!currentUser) {
                return <Redirect to={{pathname: 'login', state: {from: props.location}}}/> //eslint-disable-line
            }
            return <Component {...props}/>
        }}/>
)
