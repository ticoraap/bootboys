import axios from 'axios';
import sharedMethods from './components/shared/SharedMethods';
import {authHeader} from './components/LoginComponent/auth-header';

const instance = axios.create({
    baseURL: sharedMethods.getURL('')
})

instance.interceptors.request.use(request => {
    request.headers = {
        ...request.headers,
        ...authHeader()
    }
    return request
}, error => {
    console.log(error);
    return Promise.reject(error)
})

export default instance;