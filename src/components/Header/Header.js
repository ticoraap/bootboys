import React, {Component} from "react";
import Logo from '../../assets/images/boatLogo.png';
import classes from './Header.css';

export default class Header extends Component {
    render() {
        return (
            <header>
                <a>
                    <img src={Logo} alt={'Logo of a boat'} width={'100px'}/>
                    <p className={classes.NameLogo}>BoatBnB</p>
                </a>
            </header>
        );
    }
}
