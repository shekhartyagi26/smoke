import * as BaseProvider from './BaseProvider'

/* Provider for User Registration */
const create = (model, body, res) => {
    return new Promise((resolve, reject) => {
        if (!body.brandname && !body.bat_id) {
            reject(new Error('All fields are Required'))
        } else if (!body.brandname) {
            reject(new Error('Brand Name is Required'))
        } else if (!body.bat_id) {
            reject(new Error('BAT ID is Required'))
        } else {
            resolve({...body })
        }
    })
}

export default {
    ...BaseProvider,
    create
}
