import React, {Component} from "react";
import Logo from '../../assets/images/boatLogo.png';
import './Header.css';

export default class Header extends Component {
    render() {
        return (
            <header>
                <a>
                    <img src={Logo} alt={'Logo of a boat'} width={'100px'}/>
                    <p id={'nameLogo'}>BoatBnB</p>
                </a>
            </header>
        );
    }
}
