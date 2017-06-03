import BaseAPIController from './BaseAPIController'
import TmeProvider from '../providers/TmeAccountProvider.js'
import jwt from 'jsonwebtoken'
import async from 'async'

export class TmeController extends BaseAPIController {
    /* Controller for TME Register  */
    create = (req, res) => {
        TmeProvider.create(this._db.Tme, req.body, res)
            .then((tmeUser) => {
                this._db.Tme.create(tmeUser)
                    .then(() => res.json({ status: 1 }))
                    .catch(this.handleErrorResponse.bind(null, res))
            }).catch(this.handleErrorResponse.bind(null, res))
    }

    /* Controller for TME Login  */
    tmeLogin = (req, res) => {
        this._db.Tme.find({ where: { email: req.body.email } })
            .then((user) => {
                if (!user) {
                    throw new Error('Wrong Email')
                } else {
                    let login = TmeProvider.login(this._db.Tme, req.body, user.salt)
                    this._db.Tme.find({ where: { email: login.email, password: login.password } })
                        .then((user) => {
                            if (user) {
                                this._db.Tme.update({ last_access_date: new Date() }, { where: { email: user.email } })
                                    .then((data) => {
                                        let token = jwt.sign({ token: user.id }, 'secret_key', { expiresIn: 60 * 60 })
                                        res.json({ status: 1, token: token })
                                    })
                            } else {
                                throw new Error('Wrong Password')
                            }
                        }).catch(this.handleErrorResponse.bind(null, res))
                }
            }).catch(this.handleErrorResponse.bind(null, res))
    }

    // Get TME  ....
    get = (req, res) => {
        let page = req.params.page
        let limit = parseInt(req.params.limit)
        let offset = (page - 1) * limit
        this._db.Tme.getAllTme(page, limit, offset)
            .then((data) => {
                if (data[0] === null) {
                    throw new Error('Tme data not found')
                } else {
                    res.json(data)
                }
            })
            .catch(this.handleErrorResponse.bind(null, res))
    }

    // Update  TME....
    update = (req, res) => {
        const tmeupdate = TmeProvider.updateTme(this._db, req.body, res)
        this._db.Tme.find({ where: { email: tmeupdate.email, id: req.params.id } })
            .then((docs) => {
                if (docs) {
                    this._db.Tme.update(tmeupdate, { where: { id: req.params.id } })
                    res.json('TME Data Updated')
                } else {
                    throw new Error('TME Data Not Updated')
                }
            }).catch(this.handleErrorResponse.bind(null, res))
    }

    // search outlets...
    search = (req, res) => {
        if (req.params.type === 'ALL') {
            this._db.Outlet.findAll({ where: { outlet_name: { like: '%' + req.params.keyword + '%' } } })
                .then((data) => {
                    res.json(data)
                })
                .catch(this.handleErrorResponse.bind(null, res))
        } else if (req.params.type === 'UNASSIGN') {
            this._db.Outlet.findAll({ where: { outlet_name: { like: '%' + req.params.keyword + '%' }, tme_id: null } })
                .then((data) => {
                    res.json(data)
                })
                .catch(this.handleErrorResponse.bind(null, res))
        }
    }

    // search All....
    searchAll = (req, res) => {
        if (req.params.type === 'ALL') {
            this._db.Outlet.findAll()
                .then((data) => {
                    res.json(data)
                })
                .catch(this.handleErrorResponse.bind(null, res))
        } else if (req.params.type === 'UNASSIGN') {
            this._db.Outlet.findAll({ where: { tme_id: null } })
                .then((data) => {
                    res.json(data)
                })
                .catch(this.handleErrorResponse.bind(null, res))
        }
    }

    // assign outlet....
    assignOutlet = (req, res) => {
        let id = req.params.outlet.split(',')
        let count = id.length
        async.each(id, (item, err) => {
            count--
            this._db.Outlet.assignOutlet(item, req.params.tmeid)
                .then((data) => {
                    res.json(data)
                })
        })
    }

    // get tme by id.....
    getById = (req, res) => {
        res.json(req.tme)
    }

    // tme get by id

    tmeGetById = (req, res, next, id) => {
        this._db.Tme.findById(id)
            .then((tme) => {
                if (tme) {
                    req.tme = tme
                } else {
                    throw new Error('Invalid Tme Id')
                }
            })
            .then(next)
            .catch(this.handleErrorResponse.bind(null, res))
    }

    // get outlet by tme id ....
    getOutlet = (req, res) => {
        this._db.Outlet.getOutletByTme(req.params.tmeid)
            .then((data) => {
                if (data) {
                    res.json({ data: data })
                } else {
                    throw new Error('Invalid Tme Id')
                }
            })
            .catch(this.handleErrorResponse.bind(null, res))
    }

    // unassign outlet ....
    unAssignOutlet = (req, res) => {
        this._db.Outlet.update({ tme_id: null }, { where: { id: req.params.outletid } })
            .then((data) => {
                if (data[0]) {
                    res.json({ message: 'Sucessfully Outlet Is Unassigned' })
                } else {
                    throw new Error('Invalid Outlet Id')
                }
            })
    }
}

const controller = new TmeController()
export default controller
