import sku from '../controllers/sku'
import auth from '../middleware/auth'

export default (app) => {
    // inserting data into sku...
    app.route('/sku').post(auth.requiresLogin, sku.skuCreate)

    // fetching data from sku...
    app.route('/get/sku/:page/:limit').get(auth.requiresLogin, sku.getSku)

    // get Sku by id...
    app.route('/get/SkuById/:id').get(auth.requiresLogin, sku.getSkuById)

    // update sku...
    app.route('/sku/update/:id').put(auth.requiresLogin, sku.updateSku)

    // delete sku ....
    app.route('/sku/delete/:id').delete(auth.requiresLogin, sku.deleteSku)

    app.param('id', sku.skuById)

    return app
}
