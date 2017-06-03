import outlet from '../controllers/outlet'
import auth from '../middleware/auth'

export default (app) => {
    /* Route for Outlet Registration  */
    app.route('/outlet/create').post(outlet.create)

    // Route for Outlet Login
    app.route('/outlet/login').post(outlet.outletLogin)

    app.route('/outlet/checkLogin').get(auth.requiresLogin, outlet.checkLogin)

    /* Route for Get Outlet */
    app.route('/outlet/get/:page/:limit').get(auth.requiresLogin, outlet.get)

    // get brand by id...
    app.route('/get/outletById/:id').get(auth.requiresLogin, outlet.outletById)

    /* Route for update Outlet */
    app.route('/outlet/update/:id').put(auth.requiresLogin, outlet.update)

    app.param('id', outlet.getOutletById)

    return app
}
