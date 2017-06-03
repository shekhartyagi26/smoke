import auth from '../middleware/auth'
import advertise from '../controllers/advertise.js'

export default (app) => {
    /* Route for Avertise create  */
    app.route('/advertise/create').post(auth.requiresLogin, advertise.create)

    /* Route for Get Avertise */
    app.route('/advertise/get/:page/:limit').get(auth.requiresLogin, advertise.get)

    /* Route for update */
    app.route('/advertise/update/:id').put(auth.requiresLogin, advertise.update)

    return app
}
