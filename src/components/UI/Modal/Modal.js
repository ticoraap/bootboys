import React, { Component} from 'react';

import classes from './Modal.module.css';
import Auxiliary from '../../../HOC/Auxiliary/Auxiliary';
import Backdrop from '../Backdrop/Backdrop';
import PropTypes from 'prop-types';

class Modal extends Component {

    render(){

        let attachedClasses = [classes.Modal]
        if (this.props.onlyBackdrop){
            attachedClasses = [classes.OnlyBackdrop]
        }
        return(
            <Auxiliary>
                <Backdrop show={this.props.show} clicked={this.props.modalClosed} />
                <div 
                    className={attachedClasses.join(' ')}
                    style={{
                        transform: this.props.show ? 'translateY(0)' : 'translateY(-200vh)',
                        opacity: this.props.show ? '1' : '0'
                    }}
                    >
                    {this.props.children}
                </div>
            </Auxiliary>
        )
    }
}

Modal.propTypes = {
    show: PropTypes.bool,
    children: PropTypes.any,
    modalClosed: PropTypes.func,
    onlyBackdrop: PropTypes.bool
};

export default Modal;