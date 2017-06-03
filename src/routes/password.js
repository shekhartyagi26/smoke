import password from '../controllers/password'
import auth from '../middleware/auth'

export default (app) => {
    /* Route for User Registration  */
    app.route('/password/change/:account_type/:id').put(auth.requiresLogin, password.passwordChange)

    return app
}
