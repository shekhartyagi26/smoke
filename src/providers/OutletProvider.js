import crypto from 'crypto'
import * as BaseProvider from './BaseProvider'

/* Provider for User Registration */
const create = (model, body, res) => {
    return new Promise((resolve, reject) => {
        if (!body.bat_id && !body.membership_number && !body.email && !body.password && !body.first_name && !body.last_name && !body.birthday && !body.membership_id && !body.outlet_name) {
            reject(new Error('All fields are Required'))
        } else if (!body.bat_id) {
            reject(new Error('BAT ID is Required'))
        } else if (!body.membership_number) {
            reject(new Error('Membership Number is Required'))
        } else if (!body.password) {
            reject(new Error('Password is Required'))
        } else if (!body.first_name) {
            reject(new Error('First Name is Required'))
        } else if (!body.last_name) {
            reject(new Error('Last Name is Required'))
        } else if (!body.birthday) {
            reject(new Error('Birthday is Required'))
        } else if (!body.membership_id) {
            reject(new Error('Membership Type is Required'))
        } else if (!body.outlet_name) {
            reject(new Error('Outlet Name is Required'))
        } else {
            let date = new Date()
            let salt = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
            let password = crypto.createHash('sha256').update(body.password + ':' + salt).digest('base64')
            resolve({...body, ... { salt }, ... { password } })
        }
    })
}

/* Provider for Outlet login */
const login = (model, body, salt) => {
    let password = crypto.createHash('sha256').update(body.password + ':' + salt).digest('base64')
    return {...body, ... { password } }
}

/* Provider for Outlet Update */
const updateOutlet = (model, body, res) => {
    let date = new Date()
    let salt = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
    let password = crypto.createHash('sha256').update(body.password + ':' + salt).digest('base64')
    return {...body, ... { password } }
}

export default {
    ...BaseProvider,
    create,
    login,
    updateOutlet
}
