import async from 'async'
export default function(sequelize, DataTypes) {
    const Sku = sequelize.define('SKU', {
        productname: DataTypes.STRING,
        bat_id: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        },
        skumax: DataTypes.BOOLEAN,
        brand_id: {
            type: DataTypes.INTEGER,
            references: 'BRAND',
            referencesKey: 'id',
            allowNull: true
        },
        basepoint: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        fromdate: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        hooks: {
            beforeCreate: function(SKU, options) {
                return new Promise((resolve, reject) => {
                    this.findOne({ where: { bat_id: SKU.bat_id } })
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

        classMethods: {
            // get all sku data...
            getSkuBrand(limit, offset) {
                return new Promise((resolve, reject) => {
                    const sku = []
                    this.findAll({ offset, limit, order: '`id` DESC' })
                        .then((data) => {
                            let count = data.length
                            if (data[0] != null) {
                                async.each(data, (item, err) => {
                                    if (!item) {
                                        reject(err)
                                    } else {
                                        sequelize.import('Brand').findAll({ where: { id: item.brand_id } })
                                            .then((data) => {
                                                if (data[0] != null) {
                                                    const details = {
                                                        sku: item,
                                                        brandName: data[0].dataValues.brandname
                                                    }
                                                    sku.push(details)
                                                } else {
                                                    const details = {
                                                        sku: item,
                                                        brandName: null
                                                    }
                                                    sku.push(details)
                                                }

                                                count--
                                                if (count === 0) {
                                                    resolve(sku)
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

            getUserIDBySku(sku_bat_id, res) {
                return new Promise((resolve, reject) => {
                    this.find({ where: { bat_id: sku_bat_id } })
                        .then((data) => {
                            if (data) {
                                const id = data.id
                                resolve({ id })
                            } else {
                                res.json('not found sku_bat_id')
                            }
                        })
                        .catch((error) => { res.json({ error }) })
                })
            }
        },
        associate: (models) => {
            Sku.hasOne(models.Promotion, { foreignKey: 'sku_id' })
            Sku.hasOne(models.Sales_order, { foreignKey: 'sku_id' })
            Sku.hasOne(models.Sales_return, { foreignKey: 'sku_id' })
            Sku.belongsTo(models.Brand, { foreignKey: 'brand_id' })
        }
    })
    return Sku
}
