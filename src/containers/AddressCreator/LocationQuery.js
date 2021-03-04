import axios from 'axios';

export const queryAddressLatLong = (address) => {
    return new Promise((resolve, reject) => {
        const searchParams = {
            format: 'json',
            street: address.street + ' ' + address.houseNumber,
            postalcode: address.postalcode,
            city: address.city,
            country: address.country,
        }
        const searchParamsString = new URLSearchParams(searchParams).toString();

        axios.get('https://nominatim.openstreetmap.org/search/?' + searchParamsString)
            .then(response => {
                if (response.data.length) {
                    const latlon = {
                        lat: response.data[0].lat,
                        lon: response.data[0].lon
                    }
                    resolve(latlon)
                } else {
                    reject(response)
                }
            })
            .catch(error => {
                reject(error)
            })

    })

}
