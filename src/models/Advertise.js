export default function(sequelize, DataTypes) {
    const Advertise = sequelize.define('ADVERTISE', {
        headline: DataTypes.STRING,
        description: DataTypes.STRING,
        type: DataTypes.ENUM('All', 'Targeted'),
        outlets: DataTypes.INTEGER,
        fromdate: DataTypes.DATE,
        todate: DataTypes.DATE,
        status: DataTypes.ENUM('Live', 'Expired', 'Unpublised'),
        image: DataTypes.STRING
    }, {
        timestamps: true,
        freezeTableName: true,
        allowNull: false,

        classMethods: {
            getAllAdvertise(page, limit, offset) {
                return new Promise((resolve, reject) => {
                    if (page === '-1') {
                        this.findAll({ order: '`id` DESC' })
                            .then((data) => {
                                resolve(data)
                            })
                    } else {
                        this.findAll({
                                offset,
                                limit,
                                order: '`id` DESC'
                            })
                            .then((data) => {
                                resolve(data)
                            })
                    }
                })
            }
        }
    })
    return Advertise
}
