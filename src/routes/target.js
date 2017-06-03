import auth from '../middleware/auth'
import target from '../controllers/target'

export default (app) => {
    /* Route for Create Outlet target */
    app.route('/outlet/target').post(auth.requiresLogin, target.create)

    /* Route for Get Outlet target */
    app.route('/outlet/get/:page/:limit').get(auth.requiresLogin, target.get)

    /* Route for update Outlet target */
    app.route('/outlet/update/:id').put(auth.requiresLogin, target.update)

    return app
}
