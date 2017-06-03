export default function(sequelize, DataTypes) {
    const RebateRequest = sequelize.define('Rebate_Request', {
        outlet_id: {
            type: DataTypes.INTEGER,
            references: 'Outlet',
            referencesKey: 'outlet_id',
            allowNull: false
        },
        rebate_value: DataTypes.INTEGER,
        redeemed_points: DataTypes.INTEGER,
        request_date: DataTypes.DATE,
        rebate_details: DataTypes.STRING,
        status: {
            type: DataTypes.STRING,
            defaultValue: 'pending'
        },
        status_date: DataTypes.DATE
    }, {
        timestamps: true,
        freezeTableName: true,
        classMethods: {
            getAll(limit, offset, page) {
                return new Promise((resolve, reject) => {
                    if (!limit) {
                        this
                            .findAll({
                                include: [{
                                    model: sequelize.import('Outlet'),
                                    required: true
                                }]
                            })
                            .then((data) => { resolve({ data }) })
                            .catch((error) => { reject(error) })
                    } else {
                        this
                            .findAll({
                                include: [{
                                    model: sequelize.import('Outlet'),
                                    required: true
                                }],
                                offset,
                                limit
                            })
                            .then((data) => { resolve(data) })
                            .catch((error) => { reject(error) })
                    }
                })
            },
            findByQuery(query) {
                return new Promise((resolve, reject) => {
                    this.findOne({
                            where: query,
                            include: [{
                                model: sequelize.import('Outlet'),
                                required: true
                            }]
                        })
                        .then((data) => { resolve(data) })
                        .catch((error) => { reject(error) })
                })
            }
        },
        associate: (models) => {
            RebateRequest.belongsTo(models.Outlet, { foreignKey: 'outlet_id' })
        }
    })
    return RebateRequest
}
