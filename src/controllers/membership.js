import BaseAPIController from './BaseAPIController'
import MembershipProvider from '../providers/MembershipProvider'

export class MembershipController extends BaseAPIController {
    // add membership....
    create = (req, res) => {
        MembershipProvider.create(req.body, res)
            .then((membership) => {
                this._db.Membership.create({
                        type_name: membership.type_name,
                        rebate_rate: membership.rebate_rate,
                        order: membership.order,
                        min_required_points: membership.min_required_points
                    })
                    .then((membership) => {
                        if (membership) {
                            res.json(membership)
                        } else {
                            throw new Error('Membership Data Is Not Added')
                        }
                    })
                    .catch(this.handleErrorResponse.bind(null, res))
            })

        .catch(this.handleErrorResponse.bind(null, res))
    }

    // update membership.....
    update = (req, res) => {
        this._db.Membership.update(req.body, { where: { id: req.params.id } })
            .then((membership) => {
                if (membership) {
                    res.json('Membership Data is Updated')
                } else {
                    throw new Error('Membership Data Is Not Updated')
                }
            })
            .catch(this.handleErrorResponse.bind(null, res))
    }

    // get membership data...

    get = (req, res) => {
        this._db.Membership.findAll({
                order: '`id` DESC'
            })
            .then((membership) => {
                res.json(membership)
            })
    }

    // get by id...

    getById = (req, res) => {
            res.json(req.membership)
        }
        // get id by params....
    getMembershipById = (req, res, next, id) => {
        return this._db.Membership.findById(id)
            .then((membership) => {
                req.membership = membership
            })
            .then(next)
            .catch(this.handleErrorResponse.bind(null, res))
    }
}

const controller = new MembershipController()
export default controller
