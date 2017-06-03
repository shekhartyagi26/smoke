import async from 'async'
export default function(sequelize, DataTypes) {
    const Report = sequelize.define('REPORT', {
        rollback_by: {
            type: DataTypes.INTEGER,
            references: 'Admin_Account'
        },
        sales_file_title: DataTypes.STRING,
        return_file_title: DataTypes.STRING,
        upload_date: DataTypes.DATE
    }, {
        classMethods: {
            getReport() {
                return new Promise((resolve, reject) => {
                    this.findAll({ order: '`id` ASC' })
                        .then((data) => {
                            const detail = []
                            let count = data.length
                            async.each(data, (item, err) => {
                                if (!item) {
                                    reject(err)
                                } else {
                                    const date = item.upload_date
                                    const upload_date = date.getDate() + '-' + (date.getMonth() + 1) + '-' + date.getFullYear()
                                    let type = 'RETURN'
                                    if (item.return_file_title === '' || item.return_file_title === null) {
                                        type = 'DELIVERY'
                                    } else if ((item.return_file_title !== null && item.return_file_title !== '') && (item.sales_file_title !== null && item.sales_file_title !== '')) {
                                        type = 'DELIVERY & RETURN'
                                    }
                                    sequelize.import('AdminAccount').find({ where: { id: item.rollback_by } })
                                        .then((data) => {
                                            item.rollback_by = data ? data.first_name : ''
                                            const insert = {
                                                data: item,
                                                type,
                                                upload_date
                                            }
                                            detail.push(insert)
                                            count--
                                            if (count === 0) {
                                                resolve(detail.reverse())
                                            }
                                        })
                                }
                            })
                        })
                        .catch((error) => { reject({ error }) })
                })
            }
        },
        associate: (models) => {
            Report.hasOne(models.Sales_order, { foreignKey: 'report_id' })
            Report.hasOne(models.Sales_return, { foreignKey: 'report_id' })
        },
        timestamps: true,
        freezeTableName: true,
        allowNull: true
    })
    return Report
}
