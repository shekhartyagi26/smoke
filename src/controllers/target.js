import BaseAPIController from './BaseAPIController'
import TargetProvider from '../providers/TargetProvider.js'

export class TargetController extends BaseAPIController {
    /* Controller for Target  */
    create = (req, res) => {
        const target = TargetProvider.targets(this._db.Target, req.body, res)
        this._db.Target.create(target)
            .then(res.json.bind(res))
            .catch(this.handleErrorResponse.bind(null, res))
    }

    // Fetch Target....
    get = (req, res) => {
        let page = req.params.page
        let limit = parseInt(req.params.limit)
        let offset = (page - 1) * limit
        this._db.Target.getAllTargets(page, limit, offset)
            .then((data) => {
                if (data[0] == null) {
                    throw new Error('Traget data not found')
                } else {
                    res.json(data)
                }
            })
            .catch(this.handleErrorResponse.bind(null, res))
    }

    // Update  Target....
    update = (req, res) => {
        this._db.Target.find({ where: { outlet_id: req.params.id } })
            .then((data) => {
                if (data) {
                    this._db.Target.update(req.body, { where: { outlet_id: req.params.id } })
                    res.json('Targetb Data updated')
                } else {
                    throw new Error('Invalid id')
                }
            })
            .catch(this.handleErrorResponse.bind(null, res))
    }
}

const controller = new TargetController()
export default controller
