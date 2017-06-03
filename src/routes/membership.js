import auth from '../middleware/auth'
import membership from '../controllers/membership.js'

export default (app) => {
    /* Route for membership create  */
    app.route('/membership/create').post(auth.requiresLogin, membership.create)

    /* Route for Get membership */
    app.route('/membership/get').get(auth.requiresLogin, membership.get)

    /* Route for get by id */
    app.route('/membership/getById/:id').get(auth.requiresLogin, membership.getById)

    /* Route for update */
    app.route('/membership/update/:id').put(auth.requiresLogin, membership.update)

    app.param('id', membership.getMembershipById)

    return app
}
