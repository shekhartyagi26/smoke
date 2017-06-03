import auth from '../middleware/auth'
import sales from '../controllers/sales'

export default (app) => {
    // create sales api...
    app.route('/sales/upload').post(auth.requiresLogin, sales.salesCreate)

    // update sales api ....
    app.route('/sales/update/:id').put(auth.requiresLogin, sales.salesUpdate)

    // getting sales data ....
    app.route('/sales/get/:order_type/:id').get(auth.requiresLogin, sales.getSales)

    // report create....
    app.route('/report/create').post(auth.requiresLogin, sales.reportSave)

    // get report....
    app.route('/report/get').get(auth.requiresLogin, sales.getReport)

    // sales save
    app.route('/sales/commit/:id').put(auth.requiresLogin, sales.salesCommit)

    // sales rollback...
    app.route('/sales/rollback/:type/:id').get(auth.requiresLogin, sales.salesRollback)

    return app
}
