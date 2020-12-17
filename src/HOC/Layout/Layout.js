import React, {Component} from 'react';
import classes from './Layout.module.css';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';
import * as actionTypes from '../../store/actions/actionTypes'

import Auxiliary from '../Auxiliary/Auxiliary';
import Toolbar from '../../components/Navigation/Toolbar/Toolbar';
import SideDrawer from '../../components/Navigation/SideDrawer/SideDrawer';

import Register from "../../components/RegisterComponent/Register";
import Login from '../../components/LoginComponent/Login'
import ForgotPassword from "../../components/ForgotPasswordComponent/ForgotPassword";
import Modal from '../../components/UI/Modal/Modal';
import {ToastContainer} from 'react-toastify';



class Layout extends Component {

    render() {

        this.props.onAuthCheckState()
        return (
            <Auxiliary>
                <div>
                    <Toolbar/>
                    <SideDrawer/>

                    <Modal onlyBackdrop show={this.props.showLoginModal} modalClosed={this.props.onToggleLoginModal}>
                        <Login LoginModalToggle={this.props.onToggleLoginModal} ForgotPasswordModalToggle={this.props.onToggleForgotpasswordModal}/>
                    </Modal>

                    <Modal onlyBackdrop show={this.props.showRegisterModal} modalClosed={this.props.onToggleRegisterModal}>
                        <Register toggleModal={this.props.onToggleRegisterModal} />
                    </Modal>
                    
                    <Modal onlyBackdrop show={this.props.showForgotpasswordModal} modalClosed={this.props.onToggleForgotpasswordModal}>
                        <ForgotPassword toggleModal={this.props.onToggleForgotpasswordModal} />
                    </Modal>

                    <ToastContainer
                        position="bottom-right"
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                    />
                </div>
                <main className={classes.Content}>
                    {this.props.children}
                </main>
            </Auxiliary>
        )
    }
}

Layout.propTypes = {
    children: PropTypes.any,
    onToggleLoginModal: PropTypes.func,
    onToggleRegisterModal: PropTypes.func,
    onToggleForgotpasswordModal: PropTypes.func,
    showSideDrawer: PropTypes.func,
    showLoginModal: PropTypes.bool,
    showRegisterModal: PropTypes.bool,
    showForgotpasswordModal: PropTypes.bool,
};

const mapStateToProps = state => {
    return {
        showLoginModal: state.ux.showLoginModal,
        showRegisterModal: state.ux.showRegisterModal,
        showForgotpasswordModal: state.ux.showForgotpasswordModal,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onAuthCheckState: () => dispatch(actions.authCheckState()),
        onToggleLoginModal: () => dispatch({type: actionTypes.TOGGLE_LOGIN_MODAL}),
        onToggleRegisterModal: () => dispatch({type: actionTypes.TOGGLE_REGISTER_MODAL}),
        onToggleForgotpasswordModal: () => dispatch({type: actionTypes.TOGGLE_FORGOTPASSWORD_MODAL}),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Layout);
