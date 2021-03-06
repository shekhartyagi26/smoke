import http from 'http'
import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import path from 'path'
import glob from 'glob'
import chalk from 'chalk'
import bodyParser from 'body-parser'
import config from './config'

const app = express()
app.server = http.createServer(app)

// logger
app.use(morgan('dev'))

app.get('/', (req, res) => { res.send('...') })

// 3rd party middleware
app.use(cors({ exposedHeaders: config.corsHeaders }))
app.use(bodyParser.json({ limit: config.bodyLimit }))
app.use(bodyParser.urlencoded({ extended: true }))
const initRoutes = (app) => {
    // including all routes
    glob('./routes/*.js', { cwd: path.resolve('./src') }, (err, routes) => {
        if (err) {
            console.log(chalk.red('Error occured including routes'))
            return
        }
        routes.forEach((routePath) => {
            require(routePath).default(app); // eslint-disable-line
        })
        console.log(chalk.green(`included ${routes.length} route files`))
    })
}

initRoutes(app)
app.server.listen(process.env.PORT || config.port)
console.log(`Started on port ${app.server.address().port}`);
export default app
