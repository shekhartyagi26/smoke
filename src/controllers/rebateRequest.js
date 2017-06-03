import BaseAPIController from './BaseAPIController'

class RebateRequest extends BaseAPIController {
    get = (req, res) => {
        console.log('GET RebateRequest req.paramss', req.params)
            // res.status('200').send(dummyData);

        const page = req.params.page
        const limit = parseInt(req.params.limit, 10)
        const offset = (page - 1) * limit
        this._db.RebateRequest.getAll(limit, offset, page)
            .then((data) => {
                if (!data[0]) {
                    throw new Error('Rebate requests not found')
                } else {
                    res.json(data)
                }
            })
            .catch(this.handleErrorResponse.bind(null, res))
    }

    create = (req, res) => {
        this._db.Outlet.findOne({
                where: {
                    id: req.id
                }
            })
            .then((outlet) => {
                console.log('outlet', outlet)
                if (outlet.points_value === 0) {
                    throw new Error('Not enough points to create rebate request.')
                }
                const newRebateRequest = {
                    outlet_id: outlet.id,
                    redeemed_points: outlet.points_value,
                    rebate_value: outlet.points_value * outlet.rebate_rate,
                    request_date: new Date(),
                    rebate_details: '$' + outlet.points_value * outlet.rebate_rate + ' off',
                    status_date: new Date()
                }
                return this._db.RebateRequest.create(newRebateRequest)
                    .then((result) => {
                        return this._db.Outlet.update({
                            points_value: 0
                        }, {
                            where: {
                                outlet_id: result.outlet_id
                            }
                        })
                    })
            })
            .then((result) => {
                res.status(200).send(result)
            })
            .catch((error) => {
                res.status(400).send(error.message)
            })
    }

    apply = (req, res) => {
        const QUERY = { id: req.params.id }
        this._db.RebateRequest.findByQuery(QUERY)
            .then((result) => {
                if (!result) {
                    throw new Error('Request not found')
                }
                // CHANGE REQUEST
                return this._db.RebateRequest.update({
                    status: 'accepted',
                    status_date: new Date()
                }, {
                    where: QUERY
                })
            })
            .then(() => this._db.RebateRequest.findByQuery(QUERY))
            .then((result) => {
                res.status(200).send({
                    status: 200,
                    result
                })
            })
            .catch((error) => {
                res.status(500).send(error)
            })
    }

    cancel = (req, res) => {
        console.log('CANCEL req.params.id', req.params.id)
        const QUERY = { id: req.params.id }
        let redeemedPoints
        let pointsValue
        let outletId
        this._db.RebateRequest.findByQuery(QUERY)
            .then((result) => {
                if (!result) {
                    throw new Error('Request not found')
                }
                redeemedPoints = +result.redeemed_points
                pointsValue = +result.Outlet.points_value
                outletId = result.outlet_id
                    // CHANGE REQUEST
                return this._db.RebateRequest.update({
                    status: 'cancelled',
                    status_date: new Date()
                }, {
                    where: QUERY
                })
            })
            .then(() => {
                // return points to outlet;
                return this._db.Outlet.update({
                    points_value: pointsValue + redeemedPoints
                }, {
                    where: {
                        outlet_id: outletId
                    }
                })
            })
            .then(() => {
                return this._db.RebateRequest.findByQuery(QUERY)
            })
            .then((result) => {
                res.status(200).send({
                    status: 200,
                    result
                })
            })
            .catch((error) => {
                res.status(500).send(error)
            })
    }
}

const controller = new RebateRequest()
export default controller
