import rebateRequest from '../controllers/rebateRequest'
import auth from '../middleware/auth'

// TODO: Uncomment auth.requiresLogin middleware

export default (app) => {
    // inserting data into rebateRequest..
    app.route('/add/rebateRequest').post(auth.requiresLogin, rebateRequest.create)

    // app.route('/add/rebateRequest').post(rebateRequest.create);

    // getting data of rebateRequest....
    app.route('/get/rebateRequest/:page/:limit').get(auth.requiresLogin, rebateRequest.get)

    // accepting rebate request
    app.route('/rebateRequest/apply/:id').put(auth.requiresLogin, rebateRequest.apply)

    // canceling rebate request
    app.route('/rebateRequest/cancel/:id').put(auth.requiresLogin, rebateRequest.cancel)

    // update promotion details...
    // 	app.route('/update/promotion/:id').post(auth.requiresLogin, promotion.updatePromotion);

    return app
}
