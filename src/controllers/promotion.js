import BaseAPIController from './BaseAPIController'

export class PromotionController extends BaseAPIController {
    // add promotions....
    addPromotion = (req, res) => {
        this._db.Promotion.create(req.body)
            .then(res.json.bind(res))
            .catch(this.handleErrorResponse.bind(null, res))
    }

    // get promotion
    getPromotion = (req, res) => {
        let page = req.params.page
        let limit = parseInt(req.params.limit)
        let offset = (page - 1) * limit
        this._db.Promotion.getPromotion(limit, offset, page)
            .then((data) => {
                if (!data.data[0]) {
                    throw new Error('Promotion data not found')
                } else {
                    res.json(data)
                }
            }).catch(this.handleErrorResponse.bind(null, res))
    }

    // update promotions....
    updatePromotion = (req, res) => {
        this._db.Promotion.update(req.body, { where: { id: req.params.id } })
            .then((data) => {
                if (data) {
                    res.json('Promotion data updated')
                } else {
                    throw new Error('Promotion is not updated')
                }
            }).catch(this.handleErrorResponse.bind(null, res))
    }
}

const controller = new PromotionController()
export default controller
