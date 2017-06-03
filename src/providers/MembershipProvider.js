import * as BaseProvider from './BaseProvider'

/* Provider for User Registration */
const create = (body, res) => {
    return new Promise((resolve, reject) => {
        if (!body.type_name && !body.rebate_rate && !body.order && !body.min_required_points) {
            reject(new Error('All fields are required'))
        } else if (!body.type_name) {
            reject(new Error('Membership Type Is Required'))
        } else if (!body.rebate_rate) {
            reject(new Error('Rebate Rate is required'))
        } else if (!body.order) {
            reject(new Error('Order is required'))
        } else if (!body.min_required_points) {
            reject(new Error('Minimum Point is required'))
        } else {
            resolve({...body })
        }
    })
}

export default {
    ...BaseProvider,
    create
}
