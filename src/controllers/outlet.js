import BaseAPIController from './BaseAPIController'
import OutletProvider from '../providers/OutletProvider.js'
import jwt from 'jsonwebtoken'

export class OutletController extends BaseAPIController {
    /* Controller for Outlet Register  */
    create = (req, res) => {
        OutletProvider.create(this._db, req.body, res)
            .then((outlet) => {
                this._db.outletAccount.create({
                        salt: outlet.salt,
                        password: outlet.password,
                        first_name: outlet.first_name,
                        last_name: outlet.last_name,
                        email: outlet.email,
                        mobile: outlet.mobile,
                        birthday: outlet.birthday,
                        type_name: outlet.type_name,
                        membership_number: outlet.membership_number
                    })
                    .then((data) => {
                        if (data) {
                            this._db.Outlet.create({
                                    outlet_id: data.id,
                                    bat_id: outlet.bat_id,
                                    membership_id: outlet.membership_id,
                                    outlet_name: outlet.outlet_name,
                                    points_value: outlet.points_value,
                                    points_expiration_date: outlet.points_expiration_date,
                                    rebate_rate: outlet.rebate_rate
                                })
                                .then(() => res.json({ status: 1 }))
                                .catch((error) => {
                                    this._db.outletAccount.destroy({ where: { id: data.id } })
                                    throw new Error(error)
                                })
                                .catch(this.handleErrorResponse.bind(null, res))
                        }
                    })
                    .catch(this.handleErrorResponse.bind(null, res))
            })
            .catch(this.handleErrorResponse.bind(null, res))
    }

    checkLogin = (req, res) => {
        this._db.Outlet.findOne({
                include: [{
                    model: this._db.outletAccount,
                    attributes: { exclude: ['password', 'salt'] },
                    required: true
                }],
                where: {
                    id: req.id
                        // id : 4,
                }
            })
            .then((outlet) => {
                res.status(200).send({
                    user: outlet
                })
            })
    }

    /* Controller for Outlet Login  */
    outletLogin = (req, res) => {
        this._db.outletAccount.find({ where: { email: req.body.email } })
            .then((user) => {
                if (!user) {
                    throw new Error('Wrong Email')
                } else {
                    const login = OutletProvider.login(this._db.Outlet, req.body, user.salt)
                    this._db.outletAccount.find({
                            attributes: { exclude: ['password', 'salt'] },
                            where: {
                                email: login.email,
                                password: login.password
                            }
                        })
                        .then((user) => {
                            if (user) {
                                this._db.outletAccount.update({ last_access_date: new Date() }, { where: { email: user.email } })
                                    .then((data) => {
                                        const token = jwt.sign({ token: user.id }, 'secret_key', { expiresIn: 60 * 60 })
                                        res.json({
                                            status: 1,
                                            token
                                        })
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

    // Get Outlet  ....
    get = (req, res) => {
        const page = req.params.page
        const limit = parseInt(req.params.limit, 10)
        const offset = (page - 1) * limit
        this._db.Outlet.getAllOutlets(page, limit, offset)
            .then((data) => {
                if (!data) {
                    throw new Error('Outlet Data Not Found')
                } else {
                    res.json(data)
                }
            })
            .catch(this.handleErrorResponse.bind(null, res))
    }

    // get outlet by outlet id...
    outletById = (req, res) => {
        this._db.Outlet.getOutletById(req.outlet.id)
            .then((data) => {
                if (!data) {
                    throw new Error('Outlet Data Not Found')
                } else {
                    res.json(data)
                }
            })
            .catch(this.handleErrorResponse.bind(null, res))
    }

    // get by id....
    getOutletById = (req, res, next, id) => {
        this._db.Outlet.findById(id)
            .then((outlet) => {
                if (outlet) {
                    req.outlet = outlet
                } else {
                    throw new Error('Outlet Data Not Found')
                }
            })
            .then(next)
            .catch(this.handleErrorResponse.bind(null, res))
    }

    // Update  Outlet....
    update = (req, res) => {
        const outletupdate = OutletProvider.updateOutlet(this._db, req.body, res)
        this._db.outletAccount.update({
                membership_number: outletupdate.membership_number,
                password: outletupdate.password,
                first_name: outletupdate.first_name,
                last_name: outletupdate.last_name,
                email: outletupdate.email,
                birthday: outletupdate.birthday
            }, { where: { id: req.params.id } })
            .then((data) => {
                this._db.Outlet.find({ where: { outlet_id: req.params.id } })
                    .then((docs) => {
                        if (docs) {
                            this._db.Outlet.update({
                                bat_id: outletupdate.bat_id,
                                outlet_name: outletupdate.outlet_name,
                                membership_id: outletupdate.membership_id
                            }, { where: { outlet_id: req.params.id } })
                            res.json('Outlet Data Updated')
                        } else {
                            throw new Error('Invalid Outlet Id')
                        }
                    })
                    .catch(this.handleErrorResponse.bind(null, res))
            })
    }
}

const controller = new OutletController()
export default controller
