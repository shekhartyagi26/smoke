import crypto from 'crypto'
import BaseAPIController from './BaseAPIController'

export class PasswordController extends BaseAPIController {
    // Changing Password api
    passwordChange = (req, res) => {
        let type = req.params.account_type
        let date = new Date()
        let salt = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
        let password = crypto.createHash('sha256').update(req.body.password + ':' + salt).digest('base64')
        if ((type === 'ADMIN') || (type === 'OUTLET') || (type === 'TME')) {
            if (type === 'ADMIN') {
                this._db.Admin.update({ password: password, salt: salt }, { where: { id: req.params.id } })
                    .then(() => res.json({ status: 1 }))
                    .catch(this.handleErrorResponse.bind(null, res))
            } else if (type === 'OUTLET') {
                this._db.outletAccount.update({ password: password, salt: salt }, { where: { id: req.params.id } })
                    .then(() => res.json({ status: 1 }))
                    .catch(this.handleErrorResponse.bind(null, res))
            } else if (type === 'TME') {
                this._db.Tme.update({ password: password, salt: salt }, { where: { id: req.params.id } })
                    .then(() => res.json({ status: 1 }))
                    .catch(this.handleErrorResponse.bind(null, res))
            }
        } else {
            throw new Error('Invalid Account Type')
                .catch(this.handleErrorResponse.bind(null, res))
        }
    }
}
const controller = new PasswordController()
export default controller
