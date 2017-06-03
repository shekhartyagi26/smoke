export default function(sequelize, DataTypes) {
    const Sales_return = sequelize.define('SALES_RETURN', {
        transaction_value: DataTypes.INTEGER,
        posting_date: DataTypes.DATE,
        transaction_details: DataTypes.TEXT('long'),
        sales_order_no: DataTypes.STRING,
        report_id: {
            type: DataTypes.INTEGER,
            references: 'REPORT'
        },
        sku_id: {
            type: DataTypes.INTEGER,
            references: 'SKU'
        },
        outlet_id: {
            type: DataTypes.INTEGER,
            references: 'OUTLET'
        }
    }, {
        timestamps: true,
        freezeTableName: true,
        allowNull: true,

        classMethods: {
            getReturnSales(id) {
                return new Promise((resolve, reject) => {
                    this.findAll({
                            order: '`id` DESC',
                            where: { report_id: id },
                            include: [{
                                model: sequelize.import('Report'),
                                required: true
                            }, {
                                model: sequelize.import('Sku'),
                                required: true
                            }, {
                                model: sequelize.import('Outlet'),
                                required: true
                            }]
                        })
                        .then((data) => {
                            if (data) { resolve(data) } else {
                                reject(new Error('data not found'))
                            }
                        })
                })
            },

            salesUpdate(data, id) {
                return new Promise((resolve, reject) => {
                    this.update(data, { where: { id } })
                        .then(data => resolve(data))
                        .catch(error => reject(error))
                })
            }
        },
        associate: (models) => {
            Sales_return.belongsTo(models.Report, { foreignKey: 'report_id' })
            Sales_return.belongsTo(models.Sku, { foreignKey: 'sku_id' })
            Sales_return.belongsTo(models.Outlet, { foreignKey: 'outlet_id' })
        }

    })
    return Sales_return
}
