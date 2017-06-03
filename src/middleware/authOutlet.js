import moment from 'moment'
import jwt from 'jsonwebtoken'
import db from '../db'

export class AuthController {
    // middleware for logged in users
    requiresLogin(req, res, next) {
        var token = req.param('accessToken')
        if (token) {
            jwt.verify(token, 'secret_key', function(err, docs) {
                if (err) {
                    res.json(403, { msg: err })
                } else {
                    req.token = docs.token
                    db.Outlet.find({ where: { id: req.token } })
                        .then(function(user) {
                            req.user = user
                            next()
                        })
                }
            })
        } else {
            res.json(403, { msg: 'User Not Logged in' })
        }
    }
}

const controller = new AuthController()
export default controller
