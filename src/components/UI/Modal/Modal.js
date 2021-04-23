import React, { Component } from "react";
import classes from "./Modal.module.css";
import PropTypes from "prop-types";

import Backdrop from "../Backdrop/Backdrop";

class Modal extends Component {
    render() {
        return (
            <>
                <Backdrop
                    show={this.props.show}
                    clicked={this.props.modalClosed}
                />
                <div
                    className={classes.Modal}
                    style={{
                        transform: this.props.show
                            ? "translateY(0)"
                            : "translateY(-200vh)",
                        opacity: this.props.show ? "1" : "0",
                    }}
                >
                    {this.props.children}
                </div>
            </>
        );
    }
}

Modal.propTypes = {
    show: PropTypes.bool,
    children: PropTypes.any,
    modalClosed: PropTypes.func,
    onlyBackdrop: PropTypes.bool,
};

export default Modal;
