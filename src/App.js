import React, {Component} from 'react';
import './App.css';
import {BrowserRouter, Route, Switch} from "react-router-dom";
import PageNotFound from "./components/PageNotFoundComponent/PageNotFound";
import Layout from './HOC/Layout/Layout';
import PrivateRoute from "./components/Login/PrivateRoute";

// containers
import Account from "./containers/Account/Account";
import DockSearcher from './containers/DockSearcher/DockSearcher';
import Dock from './containers/Dock/Dock'; 
import DockCreator from './containers/DockCreator/DockCreator';

import 'react-toastify/dist/ReactToastify.css';
import {loadStripe} from "@stripe/stripe-js";
import {Elements} from "@stripe/react-stripe-js";
import DockManager from './containers/DockManager/DockManager';
import FacilityCreator from "./containers/FacilityCreator/FacilityCreator";
const stripePromise = loadStripe(process.env.REACT_APP_PUBLISHABLE_KEY, {locale: 'en'});

class App extends Component {

    render() {
        return (
            <Elements stripe={stripePromise}>
                <div>
                    <BrowserRouter>
                        <Layout LoginModalToggle={this.toggleLoginModal} RegisterModalToggle={this.toggleRegisterModal} >
                            <Switch>
                                <Route exact path="/" component={DockSearcher}/>
                                <Route exact path="/create-dock" component={DockCreator}/>
                                <PrivateRoute exact path="/Account" component={Account}/>
                                <Route exact path='/rent-dock' component={DockSearcher}/>
                                <Route exact path='/contact' component={() => <h1>Test123</h1>}/>
                                <Route exact path='/facilitys' component={FacilityCreator}/>
                                <Route exact path='/dock' component={Dock}/>
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
