import async from 'async'
export default function(sequelize, DataTypes) {
    const Brand = sequelize.define('BRAND', {
        brandname: DataTypes.STRING,
        bat_id: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        }
    }, {
        hooks: {
            beforeCreate: function(BRAND, options) {
                return new Promise((resolve, reject) => {
                    this.findOne({ where: { bat_id: BRAND.bat_id } })
                        .then((batid) => {
                            if (batid) {
                                reject(new Error('BAT ID already used. Please provide a unique BAT ID'))
                            } else {
                                resolve()
                            }
                        })
                })
            }
        },
        timestamps: true,
        freezeTableName: true,
        allowNull: false,

        classMethods: {
            // get all brand....
            getBrandSku(limit, offset) {
                return new Promise((resolve, reject) => {
                    const skuNumber = []
                    const brand = []
                    this.findAll({ offset, limit, order: '`id` DESC' })
                        .then((data) => {
                            let count = data.length
                            if (data[0] != null) {
                                async.each(data, (item, err) => {
                                    if (!item) {
                                        reject(new Error(err))
                                    } else {
                                        sequelize.import('Sku').count({ where: { brand_id: item.id } })
                                            .then((number) => {
                                                const details = {
                                                    brand: item,
                                                    skuNumber: number
                                                }
                                                brand.push(details)
                                                count--
                                                if (count === 0) {
                                                    resolve(brand)
                                                }
                                            })
                                    }
                                })
                            } else {
                                resolve(data)
                            }
                        })
                        .catch((error) => { reject({ error }) })
                })
            },

            // get brand by id...
            getBrandById(id) {
                return new Promise((resolve, reject) => {
                    const brand = []
                    this.findAll({ where: { id } })
                        .then((data) => {
                            if (!data) {
                                reject(new Error(data))
                            } else {
                                sequelize.import('Sku').count({ where: { brand_id: data[0].dataValues.id } })
                                    .then((number) => {
                                        const details = {
                                            brand: data,
                                            skuNumber: number
                                        }
                                        brand.push(details)
                                        resolve(details)
                                    })
                            }
                        })
                })
            }
        },
        associate: (models) => {
            Brand.hasMany(models.Sku, { foreignKey: 'brand_id' })
        }
    })
    return Brand
}
