import admin from '../controllers/adminAccount'
import auth from '../middleware/auth'

export default (app) => {
    /* Route for User Registration  */
    app.route('/admin/register').post(admin.create)

    /* Route for User Login  */
    app.route('/admin/login').post(admin.adminLogin)

    return app
}
