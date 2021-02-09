import React, { Component } from 'react';
import classes from './DockManager.module.css';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import * as actions from '../../store/actions/index';

import DockCreator from '../DockCreator/DockCreator';
import DockCard from '../../components/DockCard/DockCard';
import Button from '../../components/UI/Button/Button';
import Modal from '../../components/UI/Modal/Modal';
import ConfirmationQuestion from '../../components/ConfirmationQuestion/ConfirmationQuestion';
import Map from '../../components/Map/Map';

export class DockManager extends Component{

    state = {
        editNew: false,
        removeWarning: false,
        dockToRemove: null
    }

    componentDidMount(){
        this.props.onGetUserDocks()
    }

    toEditDock = () => {
        this.setState({editNew: true})
    }
    toMap = () => {
        this.setState({editNew: false})
    }

    removeDock = (dock) => {
        if (!this.state.removeWarning){
            this.setState({removeWarning: true, dockToRemove: dock})
            return
        }
        this.props.onremoveDock(this.state.dockToRemove.dockid)
        this.cancelRemove()
    }

    cancelRemove = () => {
        this.setState({removeWarning: false, dockToRemove: null})
    }

    getListOfDockCards = (docks) => {
        const dockCards = docks.map(dock => {
            return <DockCard 
                        key={dock.dockid}
                        name={dock.name}
                        description={dock.description}
                        length={dock.length}
                        width={dock.width}
                        price={dock.price}
                        numFacilities={dock.numfacilities}
                        edit={() => this.editDock(dock)}
                        remove={() => this.removeDock(dock)}
                        styleName='DockManager'
                    />
        })

        return (
            <div className={classes.DockManagerList}>
                {dockCards}
            </div>
        )
    }

    render(){
        const listOfDockCards = this.getListOfDockCards(this.props.userDocks)
        const confirmDeleteModal = (
            <Modal show={this.state.removeWarning} modalClosed={this.cancelRemove}>
                <ConfirmationQuestion
                    question={"Are you sure you want to remove this dock?"}
                    acceptLabel="Yes remove"
                    declineLabel="Cancel"
                    accept={this.removeDock}
                    decline={this.cancelRemove}
                />
            </Modal>
        )


        let message = <p>Add and remove your owned docks</p>

        if (!this.props.userDocks.length && !this.state.editNew){
            message = <p>{"You dont'have any docks at the moment, klick on the button \"New Dock\" to create your first dock"}</p>
        }
        
        if (!this.props.userDocks.length && this.state.editNew){
            message = <p>{"Fill in the details to create your first Dock."}</p>
        }

        return(
            <div>
                {confirmDeleteModal}
                <h4>Manage your docks</h4>
                {message}
                <div className={classes.DockManagerButtons}>
                    <Button disabled={this.state.editNew} btnType='DockManager' clicked={this.toEditDock} >New Dock</Button>
                    <Button disabled={!this.state.editNew} btnType='DockManager' clicked={this.toMap} >Map</Button>
                </div>

                
                <div className={classes.DockManager} >
                    {this.state.editNew ? null : listOfDockCards}
                    
            
                    <div className={classes.DockManagerCreator} >
                    {this.state.editNew ? <DockCreator notifyDockManagerDockCreated={this.toMap} /> : <Map bounds center={[52.16121472938702, 4.501615852518094]} zoom={5} docks={this.props.userDocks}/> }
                    </div>
                </div>
            </div>
        )
    }
}

DockManager.propTypes = {
    onGetUserDocks: PropTypes.func,
    onremoveDock: PropTypes.func,
    userDocks: PropTypes.any,
    userDocksLoading: PropTypes.bool,
};


const mapStateToProps = state => {
    return {
        userDocks: state.user.userDocks,
        userDocksLoading: state.user.userDocksLoading
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onGetUserDocks: () => dispatch(actions.getUserDocks()),
        onremoveDock: (dockid) => dispatch(actions.removeDock(dockid)),
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(DockManager);
