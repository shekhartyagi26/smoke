export default function(sequelize, DataTypes) {
    const Membership = sequelize.define('Membership_Type', {
        type_name: DataTypes.STRING,
        rebate_rate: DataTypes.INTEGER,
        min_required_points: DataTypes.INTEGER,
        order: DataTypes.INTEGER
    }, {
        timestamps: true,
        freezeTableName: true,

        associate: (models) => {
            Membership.hasOne(models.Outlet, { foreignKey: 'membership_id' })
        }
    })
    return Membership
}
