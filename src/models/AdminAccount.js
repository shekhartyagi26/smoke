export default function(sequelize, DataTypes) {
    const Admin = sequelize.define('Admin_Account', {
        first_name: DataTypes.STRING,
        last_name: DataTypes.STRING,
        email: {
            type: DataTypes.STRING,
            unique: true
        },
        password: DataTypes.STRING,
        salt: DataTypes.STRING,
        last_access_date: {
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        hooks: {
            beforeCreate: function(Admin_Account, options) {
                return new Promise((resolve, reject) => {
                    this.findOne({ where: { email: Admin_Account.email } })
                        .then((admin) => {
                            if (admin) {
                                reject(new Error('Email Already In Use'))
                            } else {
                                resolve()
                            }
                        })
                })
            }
        },
        timestamps: true,
        freezeTableName: true
    })
    return Admin
}
