import BaseAPIController from './BaseAPIController'
import AdminProvider from '../providers/AdminAccountProvider.js'
import jwt from 'jsonwebtoken'

export class UserController extends BaseAPIController {
    /* Controller for User Register  */
    create = (req, res) => {
        AdminProvider.create(this._db.Admin, req.body)
            .then((admin) => {
                this._db.Admin.create(admin)
                    .then(() => res.json({ status: 1 }))
                    .catch(this.handleErrorResponse.bind(null, res))
            })
            .catch(this.handleErrorResponse.bind(null, res))
    }

    /* Controller for User Login  */
    adminLogin = (req, res) => {
        this._db.Admin.find({ where: { email: req.body.email } })
            .then((admin) => {
                if (!admin) {
                    throw new Error('Invalid Email')
                } else {
                    const login = AdminProvider.login(req.body, admin.salt)
                    this._db.Admin.find({ where: { email: login.email, password: login.password } })
                        .then((admin) => {
                            if (admin) {
                                this._db.Admin.update({ last_accessed: new Date() }, { where: { id: admin.id } })
                                    .then((data) => {
                                        const token = jwt.sign({ token: admin.id }, 'secret_key', { expiresIn: 60 * 60 })
                                        res.json({ status: 1, token })
                                    })
                            } else {
                                throw new Error('Wrong Password')
                            }
                        })
                        .catch(this.handleErrorResponse.bind(null, res))
                }
            })
            .catch(this.handleErrorResponse.bind(null, res))
    }
}

const controller = new UserController()
export default controller
