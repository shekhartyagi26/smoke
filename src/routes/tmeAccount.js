import tme from '../controllers/tmeAccount'
import auth from '../middleware/authTme'

export default (app) => {
    /* Route for User Registration  */
    app.route('/tme/register').post(tme.create)

    // Route for User Login
    app.route('/tme/login').post(tme.tmeLogin)

    /* Route for Get TME */
    app.route('/tme/get/:page/:limit').get(auth.requiresLogin, tme.get)

    /* route for get by id */
    app.route('/tme/getById/:id').get(auth.requiresLogin, tme.getById)

    /* Route for update TME */
    app.route('/tme/update/:id').put(auth.requiresLogin, tme.update)
        /* route of searching */
    app.route('/tme/searchoutlet/:type/:keyword').get(auth.requiresLogin, tme.search)

    /* route for search all */
    app.route('/tme/searchoutlet/:type').get(auth.requiresLogin, tme.searchAll)

    /* route for assign outlet */
    app.route('/tme/assignoutlet/:outlet/:tmeid').put(auth.requiresLogin, tme.assignOutlet)

    /* outlet list */
    app.route('/tme/outlet/:tmeid').get(auth.requiresLogin, tme.getOutlet)

    /* Unassign Outlet */
    app.route('/tme/unassignoutlet/:outletid').put(auth.requiresLogin, tme.unAssignOutlet)

    app.param('id', tme.tmeGetById)

    return app
}
