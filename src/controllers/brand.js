import BaseAPIController from './BaseAPIController'
import BrandProvider from '../providers/BrandProvider.js'

export class BrandController extends BaseAPIController {
    // inserting data into brand..

    brandCreate = (req, res) => {
        BrandProvider.create(this._db.Brand, req.body, res)
            .then((brand) => {
                this._db.Brand.create(brand)
                    .then(res.json.bind(res))
                    .catch(this.handleErrorResponse.bind(null, res))
            }).catch(this.handleErrorResponse.bind(null, res))
    }

    // fetching data from brand...
    getBrand = (req, res) => {
        let page = req.params.page
        let limit = parseInt(req.params.limit)
        let offset = (page - 1) * limit
        this._db.Brand.getBrandSku(limit, offset)
            .then((data) => {
                if (!data) {
                    throw new Error('Brand data not found')
                } else {
                    res.json(data)
                }
            })
            .catch(this.handleErrorResponse.bind(null, res))
    }

    // get brand by id...
    getBrandById = (req, res) => {
        res.json(req.brand)
    }

    brandGetById = (req, res, next, id) => {
        this._db.Brand.findById(id)
            .then((brand) => {
                if (brand) {
                    req.brand = brand
                } else {
                    throw new Error('Invalid id')
                }
            })
            .then(next)
            .catch(this.handleErrorResponse.bind(null, res))
    }

    // update brand ....
    updateBrand = (req, res) => {
        let id = req.params.id
        this._db.Brand.find({ where: { bat_id: req.body.bat_id } })
            .then((data) => {
                if (data) {
                    throw new Error('BAT ID already used. Please provide a unique BAT ID')
                } else {
                    this._db.Brand.find({ where: { id: id } })
                        .then((data) => {
                            if (data) {
                                this._db.Brand.update(req.body, { where: { id: id } })
                                    .then(() => res.json('Brand updated'))
                                    .catch(this.handleErrorResponse.bind(null, res))
                            } else {
                                throw new Error('Invalid id')
                            }
                        }).catch(this.handleErrorResponse.bind(null, res))
                }
            })
            .catch(this.handleErrorResponse.bind(null, res))
    }

    // delete brand ....
    deleteBrand = (req, res) => {
        let id = req.params.id
        this._db.Brand.destroy({ where: { id: id } })
            .then((response) => {
                if (response === 1) {
                    res.json('Brand data Deleted')
                } else {
                    throw new Error('Invalid id')
                }
            }).catch(this.handleErrorResponse.bind(null, res))
    }
}
const controller = new BrandController()
export default controller
