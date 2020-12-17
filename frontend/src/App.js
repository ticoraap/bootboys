import React, {Component} from 'react';
import './App.css';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import DockCreator from './containers/DockCreator/DockCreator';
import PageNotFound from "./components/PageNotFoundComponent/PageNotFound";
import Layout from './HOC/Layout/Layout';
import PrivateRoute from "./components/LoginComponent/PrivateRoute";
import Account from "./components/AccountComponent/Account";
import RentDockList from "./components/RentDockList/RentDockList";
import Dock from './components/DockComponent/Dock'

import 'react-toastify/dist/ReactToastify.css';
import {loadStripe} from "@stripe/stripe-js";
import {Elements} from "@stripe/react-stripe-js";
import PaymentRentDock from "./components/DockComponent/PaymentComponent/PaymentRentDock";
import DockManager from './containers/DockManager/DockManager';
import FacilityCreator from "./containers/FacilityCreator/FacilityCreator";
const stripePromise = loadStripe(process.env.REACT_APP_PUBLISHABLE_KEY, {locale: 'en'});

class App extends Component {

    render() {
        return (
            <Elements stripe={stripePromise}>
                <div>
                    <BrowserRouter>
                        <Layout LoginModalToggle={this.toggleLoginModal} ForgotPasswordModalToggle={this.toggleForgotPasswordModal} RegisterModalToggle={this.toggleRegisterModal} >
                            <Switch>
                                <Route exact path="/" component={RentDockList}/>
                                <Route exact path="/create-dock" component={DockCreator}/>
                                <PrivateRoute exact path="/Account" component={Account}/>
                                <Route exact path='/rent-dock' component={RentDockList}/>
                                <Route exact path='/contact' component={() => <h1>Test123</h1>}/>
                                <Route exact path='/facilitys' component={FacilityCreator}/>
                                <Route exact path='/dock' component={Dock}/>
                                <Route exact path='/pay' component={PaymentRentDock}/>
                                <PrivateRoute exact path='/manage-docks' component={DockManager}/>
                                <Route component={PageNotFound}/>
                            </Switch>
                        </Layout>
                    </BrowserRouter>
                </div>
            </Elements>
        )
    }
}

export default App;
