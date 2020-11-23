import React from "react";
import Error404 from '../../assets/images/404.png'
import './PageNotFound.css'

const PageNotFound = () => (
    <div className={'Error404'}>
        <h1>PAGE NOT FOUND</h1>
        <img src={Error404} alt={'Error 404 img'}/>
    </div>
);

export default PageNotFound;
