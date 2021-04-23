import React from "react";
import classes from "./Logo.module.css";

import boatLogo from "../../assets/images/boatLogo.png";

const logo = () => (
    <div className={classes.Logo}>
        <img src={boatLogo} alt="BootBoys" />
    </div>
);

export default logo;
