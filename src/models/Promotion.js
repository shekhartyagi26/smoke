export default function(sequelize, DataTypes) {
    const Promotion = sequelize.define('PROMOTION', {
        sku_id: {
            type: DataTypes.INTEGER,
            references: 'SKU',
            referencesKey: 'id'
        },
        description: DataTypes.STRING,
        point: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        fromdate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        todate: {
            type: DataTypes.DATE,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM,
            values: ['LIVE', 'ENDED', 'CANCELLED']
        }
    }, {
        timestamps: true,
        freezeTableName: true,
        allowNull: false,

        classMethods: {
            getPromotion(limit, offset, page) {
                return new Promise((resolve, reject) => {
                    if (page === -1) {
                        this.findAll({
                                order: '`id` DESC',
                                include: [{
                                    model: sequelize.import('Sku'),
                                    required: true
                                }]
                            })
                            .then((data) => { resolve({ data }) })
                    } else {
                        this.findAll({
                                offset,
                                limit,
                                include: [{
                                    model: sequelize.import('Sku'),
                                    required: true
                                }]
                            })
                            .then((data) => { resolve(data) })
                    }
                })
            }
        },
        associate: (models) => {
            Promotion.belongsTo(models.Sku, { foreignKey: 'sku_id' })
        }
    })
    return Promotion
}
