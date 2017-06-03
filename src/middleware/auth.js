import jwt from 'jsonwebtoken'

export class AuthController {
    // middleware for logged in users
    requiresLogin(req, res, next) {
        var token = req.param('accessToken')
        if (token) {
            jwt.verify(token, 'secret_key', function(err, docs) {
                if (err) {
                    res.json(403, { msg: err })
                } else {
                    req.id = docs.token
                    next()
                }
            })
        } else {
            res.json(403, { msg: 'Login Required' })
        }
    }
}

const controller = new AuthController()
export default controller
