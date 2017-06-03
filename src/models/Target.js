export default function(sequelize, DataTypes) {
    const Target = sequelize.define('TARGET', {
        outlet_id: {
            type: DataTypes.INTEGER,
            references: 'Outlet_Account',
            referencesKey: 'id'
        },
        target: DataTypes.INTEGER,
        month: DataTypes.INTEGER
    }, {
        timestamps: true,
        freezeTableName: true,
        allowNull: false,

        classMethods: {
            getAllTargets(page, limit, offset) {
                return new Promise((resolve, reject) => {
                    if (page === -1) {
                        this.findAll({ order: '`id` DESC' })
                            .then((data) => {
                                resolve(data)
                            })
                    } else {
                        this.findAll({ offset, limit })
                            .then((data) => {
                                resolve(data)
                            })
                    }
                })
            }
        }
    })
    return Target
}
