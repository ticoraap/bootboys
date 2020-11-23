import React, {Component} from "react";
import './Account.css'
import {authenticationService} from '../LoginComponent/authentication.service'
import TextField from "@material-ui/core/TextField";
import {handleResponse} from "../LoginComponent/handle-response";
import {sha256} from "js-sha256";
import {ApiService} from "../shared/Api.service";
import sharedMethods from "../shared/SharedMethods"
import ToastMaker from "../shared/ToastMaker";

export default class Account extends Component {
    constructor() {
        super();
        this.state = {
            user: authenticationService.currentUserValue,
            editDetails: false,
            username: "",
            password: "",
            firstname: "",
            surname: "",
            mail: "",
            phonenumber: "",
        }
    }

    render() {
        if (this.state.editDetails) {
            return (<div>
                <div id="elementbox">
                    <h1>Account Details</h1>
                    <div id="editform">
                        <form noValidate autoComplete="off" onSubmit={this.onSubmitEditForm.bind(this)}>
                            <TextField id="username" label="Username" defaultValue={this.state.user.username} variant={'outlined'} name="username" onChange={this.handleOnFormChange.bind(this)} margin={"normal"}/>
                            <TextField id="Password" label="Password" variant={'outlined'} value={this.state.password} name="password" onChange={this.handleOnFormChange.bind(this)} margin={"normal"}/> <br/>
                            <TextField id="Firstname" label="First Name" defaultValue={this.state.user.firstname} variant={'outlined'} name="firstname" onChange={this.handleOnFormChange.bind(this)} margin={"normal"}/>
                            <TextField id="surname" label="Surname" defaultValue={this.state.user.surname} variant={'outlined'} name="surname" onChange={this.handleOnFormChange.bind(this)} margin={"normal"}/> <br/>
                            <TextField id="phone" label="Phone Number" defaultValue={this.state.user.phonenumber} variant={'outlined'} name="phonenumber" onChange={this.handleOnFormChange.bind(this)} margin={"normal"}/> <br/>
                            <TextField id="mail" label="Email Address" defaultValue={this.state.user.mail} variant={'outlined'} name="mail" onChange={this.handleOnFormChange.bind(this)} margin={"normal"}/> <br/>
                            <button type={'submit'} id="editbutton">Save Changes</button>
                        </form>
                    </div>

                </div>
            </div>)
        }
        return (
            <div id="master">
                <div id="elementbox">
                    <h1>Account Details</h1>
                    <div id="textfields">
                        <p id="ownP">Username: {this.state.user.username} <br/>
                            Firstname: {this.state.user.firstname} <br/>
                            Surname: {this.state.user.surname} <br/>
                            Phonenumber: {this.state.user.phonenumber} <br/>
                            Email: {this.state.user.mail} <br/>
                        </p>
                    </div>
                    <button id="editbutton" onClick={this.onClickEditButton.bind(this)}>Edit Details</button>
                </div>
            </div>
        )
    }

    onClickEditButton() {
        this.setState({editDetails: true})
    }

    onSubmitEditForm(e) {
        e.preventDefault()
        let changes = this.getinput()
        if ('password' in changes) {
            changes['password'] = sha256(changes['password'])
        }
        if ('mail' in changes) {
            if (!sharedMethods.validateEmail(changes['mail'])) {
                ToastMaker.errorToast("Please enter a valid email")
                return;
            }
        }
        if ('phonenumber' in changes) {
            if (!sharedMethods.validatePhone(changes['phonenumber'])) {
                ToastMaker.errorToast("Please enter a valid phonenumber")
                return;
            }
        }
        changes['userid'] = this.state.user.userid
        ApiService.post('/tryAccountUpdate', changes).then(handleResponse).then(data => {
            if ('status' in data) {
                delete data.status;
                let message = ""
                for (let i in data) {
                    message = message + i + ' is already used \n'
                }
                if (message === ""){
                    ToastMaker.errorToast("Something went wrong when processing the input")
                }
                ToastMaker.errorToast(message)
            } else {
                delete data.status
                localStorage.setItem('currentUser', JSON.stringify(data))
                this.setState({editDetails: false})
            }
        })

    }

    handleOnFormChange(e) {
        const {target: {value, name}} = e;
        this.setState({
            [name]: value
        });
    }

    getinput() {
        let changes = {}
        for (let i in this.state) {
            if (i === 'user' || i === 'editDetails') {
                continue;
            }
            if (this.state[i] === this.state.user[i] || this.state[i] === "") {
                continue;
            }
            changes[i] = this.state[i];
        }
        return changes;
    }
}

