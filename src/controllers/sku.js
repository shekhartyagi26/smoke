import BaseAPIController from './BaseAPIController'
import SkuProvider from '../providers/SkuProvider.js'

export class SkuController extends BaseAPIController {
    // inserting data into sku..

    skuCreate = (req, res) => {
        SkuProvider.create(this._db.Sku, req.body, res)
            .then((sku) => {
                this._db.Sku.create(sku)
                    .then(res.json.bind(res))
                    .catch(this.handleErrorResponse.bind(null, res))
            }).catch(this.handleErrorResponse.bind(null, res))
    }

    // fetching data from sku
    getSku = (req, res) => {
        let page = req.params.page
        let limit = parseInt(req.params.limit)
        let offset = (page - 1) * limit
        this._db.Sku.getSkuBrand(limit, offset)
            .then((data) => {
                if (!data) {
                    throw new Error('SKU data not found')
                } else {
                    res.json(data)
                }
            })
            .catch(this.handleErrorResponse.bind(null, res))
    }

    // get sku by id..
    getSkuById = (req, res) => {
        if (req.sku) {
            this._db.Brand.findById(req.sku.id)
                .then((brand) => {
                    let data = {
                        sku: req.sku,
                        brandname: brand.brandname
                    }
                    res.json(data)
                })
                .catch(this.handleErrorResponse.bind(null, res))
        } else {
            throw new Error('Invalid id')
        }
    }

    // app.params
    skuById = (req, res, next, id) => {
        this._db.Sku.findById(id)
            .then((sku) => {
                if (sku) {
                    req.sku = sku
                }
            })
            .then(next)
            .catch(this.handleErrorResponse.bind(null, res))
    }

    // update sku...
    updateSku = (req, res) => {
        let id = req.params.id
        this._db.Sku.find({ where: { id: id } })
            .then((data) => {
                if (data) {
                    this._db.Sku.update(req.body, { where: { id: id } })
                        .then(() => res.json('SKU updated'))
                        .catch(this.handleErrorResponse.bind(null, res))
                } else {
                    throw new Error('Invalid id')
                }
            }).catch(this.handleErrorResponse.bind(null, res))
    }

    // delete sku ...

    deleteSku = (req, res) => {
        let id = req.params.id
        this._db.Sku.destroy({ where: { id: id } })
            .then((response) => {
                if (response === 1) {
                    res.json('SKU data deleted')
                } else {
                    throw new Error('Invalid id')
                }
            }).catch(this.handleErrorResponse.bind(null, res))
    }
}

const controller = new SkuController()
export default controller
