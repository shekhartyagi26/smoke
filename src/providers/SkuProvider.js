import * as BaseProvider from './BaseProvider'

/* Provider for User Registration */
const create = (model, body, res) => {
    return new Promise((resolve, reject) => {
        if (!body.brand_id && !body.productname && !body.bat_id && !body.skumax && !body.basepoint) {
            reject(new Error('All fields are Required'))
        } else if (!body.brand_id) {
            reject(new Error('Brand Id  is Required'))
        } else if (!body.productname) {
            reject(new Error('Product Name  is Required'))
        } else if (!body.bat_id) {
            reject(new Error('BAT ID is Required'))
        } else if (!body.skumax) {
            reject(new Error('Sku Max is Required'))
        } else if (!body.basepoint) {
            reject(new Error('BasePoint is Required'))
        } else {
            resolve({...body })
        }
    })
}

export default {
    ...BaseProvider,
    create
}
