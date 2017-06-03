import brand from '../controllers/brand'
import auth from '../middleware/auth'

export default (app) => {
    // inserting data into brand..
    app.route('/brand').post(auth.requiresLogin, brand.brandCreate)

    // fetching data from brand...
    app.route('/get/brand/:page/:limit').get(auth.requiresLogin, brand.getBrand)

    // get brand by id...
    app.route('/get/brandById/:id').get(auth.requiresLogin, brand.getBrandById)

    // update into brand..
    app.route('/brand/update/:id').put(auth.requiresLogin, brand.updateBrand)

    // delete brand ....
    app.route('/brand/delete/:id').delete(auth.requiresLogin, brand.deleteBrand)

    app.param('id', brand.brandGetById)

    return app
}
