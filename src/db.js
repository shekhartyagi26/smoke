import Sequelize from 'sequelize'
import models from './models'
import config from './config'
const db = {}

// create your instance of sequelize
const sequelize = new Sequelize(config.db.name, config.db.username, config.db.password, {
    host: config.db.host,
    dialectOptions: {
        timeout: 30
    },
    pool: {
        max: 5,
        min: 0,
        idle: 30000
    }
})

// load modelsa
Object.keys(models).forEach((modelName) => {
    const model = models[modelName](sequelize, Sequelize.DataTypes)
    db[modelName] = model
    console.log(`Loading model - ${modelName}`)
})

// invoke associations on each of the models
Object.keys(db).forEach((modelName) => {
    if (db[modelName].options.associate) {
        db[modelName].options.associate(db)
    }
})

sequelize.sync().then(() => {
    db.Membership.findOne({ where: { type_name: 'Gold' } })
        .then((id) => {
            if (!id) {
                db.Membership.create({ type_name: 'Gold' })
            }
        })
    db.Membership.findOne({ where: { type_name: 'Platinum' } })
        .then((id) => {
            if (!id) {
                db.Membership.create({ type_name: 'Platinum' })
            }
        })

    db.Membership.findOne({ where: { type_name: 'Diamond' } })
        .then((id) => {
            if (!id) {
                db.Membership.create({ type_name: 'Diamond' })
            }
        })
})

export default Object.assign({}, db, {
    sequelize,
    Sequelize
})
