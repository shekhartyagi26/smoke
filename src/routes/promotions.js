  import promotion from '../controllers/promotion'
  import auth from '../middleware/auth'

  export default (app) => {
      // inserting data into promotion..
      app.route('/add/promotion').post(auth.requiresLogin, promotion.addPromotion)

      // getting data of promotions....
      app.route('/get/promotion/:page/:limit').get(auth.requiresLogin, promotion.getPromotion)

      // update promotion details...
      app.route('/update/promotion/:id').post(auth.requiresLogin, promotion.updatePromotion)

      return app
  }
