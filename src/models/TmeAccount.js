export default function(sequelize, DataTypes) {
    const Tme = sequelize.define('TME_Account', {
        bat_id: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
        },
        password: DataTypes.STRING,
        salt: DataTypes.STRING,
        first_name: DataTypes.STRING,
        last_name: DataTypes.STRING,
        email: {
            type: DataTypes.STRING,
            unique: true
        },
        mobile_no: DataTypes.BIGINT,
        last_access_date: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        hooks: {
            beforeCreate: function(TME_Account, options) {
                return new Promise((resolve, reject) => {
                    this.findOne({ where: { email: TME_Account.email } })
                        .then((email) => {
                            if (email) {
                                reject(new Error('Email Already In Use'))
                            } else {
                                this.findOne({ where: { bat_id: TME_Account.bat_id } })
                                    .then((batid) => {
                                        if (batid) {
                                            reject(new Error('BAT ID already used. Please provide a unique BAT ID'))
                                        } else {
                                            resolve()
                                        }
                                    })
                            }
                        })
                })
            }
        },
        timestamps: true,
        freezeTableName: true,

        classMethods: {
            getAllTme(page, limit, offset) {
                return new Promise((resolve, reject) => {
                    if (page === -1) {
                        this.findAll({ order: '`id` DESC' })
                            .then((data) => {
                                resolve(data)
                            })
                    } else if (page > 0) {
                        this.findAll({
                                offset,
                                limit
                            })
                            .then((data) => {
                                resolve(data)
                            })
                    } else {
                        reject(new Error('Invalid Page Number'))
                    }
                })
            }
        },
        associate: (models) => {
            Tme.hasOne(models.Outlet, { foreignKey: 'tme_id' })
        }
    })
    return Tme
}
