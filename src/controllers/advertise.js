import BaseAPIController from './BaseAPIController'

export class AdvertiseController extends BaseAPIController {
    create = (req, res) => {
        this._db.Advertise.create(req.body)
            .then(res.json.bind(res))
            .catch(this.handleErrorResponse.bind(null, res))
    }

    // GET data from advertise...
    get = (req, res) => {
        let page = req.params.page
        let limit = parseInt(req.params.limit)
        let offset = (page - 1) * limit
        this._db.Advertise.getAllAdvertise(page, limit, offset)
            .then((data) => {
                if (data[0] == null) {
                    throw new Error('Advertise data not found')
                } else {
                    res.json(data)
                }
            })
            .catch(this.handleErrorResponse.bind(null, res))
    }

    // Update  Advertise....
    update = (req, res) => {
        this._db.Advertise.update(req.body, { where: { id: req.params.id } })
            .then((data) => {
                if (data) {
                    res.json('Advertise data updated')
                } else {
                    throw new Error('Advertise data is not updated')
                }
            })
            .catch(this.handleErrorResponse.bind(null, res))
    }
}

const controller = new AdvertiseController()
export default controller
