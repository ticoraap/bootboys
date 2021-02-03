import {authenticationService} from "./authentication.service";
import sharedMethods from "../shared/SharedMethods";

export function handleResponse(response) {
    return response.text().then(text => {
        const data = text && sharedMethods.parseJSON(text)
        if (!response.ok) {
            if ([401, 403].indexOf(response.status) !== -1) {
                authenticationService.logout()
            }
            const error = (data && data.message) || response.statusText;
            return Promise.reject(error)
        }
        return data;
    })

}
