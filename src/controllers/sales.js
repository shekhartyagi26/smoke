import BaseAPIController from './BaseAPIController'

export class BrandController extends BaseAPIController {
    // inserting data into brand..

    salesCreate = (req, res) => {
        this._db.Outlet.find({ where: { outlet_id: req.body.outlet_id } })
            .then((data) => {
                const OUTLET = data
                if (data) {
                    req.body.outlet_id = data.id
                } else {
                    throw new Error('Outlet BAT ID Not Found')
                }
                this._db.Sku.find({ where: { bat_id: req.body.sku_id } })
                    .then((data) => {
                        const SKU = data
                        if (data) {
                            req.body.sku_id = data.id
                            if (req.body.order_type === 'DELIVERY') {
                                this._db.Sales_order.create({
                                        transaction_value: req.body.transaction_value,
                                        outlet_id: req.body.outlet_id,
                                        sku_id: req.body.sku_id,
                                        report_id: req.body.report_id,
                                        posting_date: req.body.posting_date,
                                        transaction_details: req.body.transaction_details,
                                        sales_order_no: req.body.sales_order_no
                                    })
                                    .then((data) => {
                                        return new Promise((resolve, reject) => {
                                                const reportDate = JSON.parse(req.body.transaction_details)
                                                console.log('reportDate', reportDate)
                                                resolve(reportDate)
                                            })
                                            .then((reportDate) => {
                                                return this._db.Outlet.update({
                                                    points_value: OUTLET.points_value + SKU.basepoint
                                                }, {
                                                    where: {
                                                        outlet_id: req.body.outlet_id
                                                    }
                                                })
                                            })
                                            .then((result) => {
                                                res.json({ status: 1 })
                                            })
                                    })
                                    .catch(this.handleErrorResponse.bind(null, res))
                            } else if (req.body.order_type === 'RETURN') {
                                this._db.Sales_return.create({
                                        transaction_value: req.body.transaction_value,
                                        outlet_id: req.body.outlet_id,
                                        sku_id: req.body.sku_id,
                                        report_id: req.body.report_id,
                                        posting_date: req.body.posting_date,
                                        transaction_details: req.body.transaction_details,
                                        sales_return_no: req.body.sales_return_no
                                    })
                                    .then((data) => { res.json({ status: 1 }) })
                                    .catch(this.handleErrorResponse.bind(null, res))
                            } else {
                                throw new Error('Invalid type')
                            }
                        } else {
                            throw new Error('SKU BAT ID Not Found')
                        }
                    })
                    .catch(this.handleErrorResponse.bind(null, res))
            })
            .catch(this.handleErrorResponse.bind(null, res))
    }

    // upadating sales data ....
    salesUpdate = (req, res) => {
        if (req.body.order_type === 'DELIVERY') {
            const data = {
                transaction_value: req.body.transaction_value,
                transaction_details: req.body.transaction_details
            }
            this._db.Sales_order.salesUpdate(data, req.params.id)
                .then((data) => {
                    if (data) {
                        res.json('data updated')
                    } else {
                        throw new Error('Data Not Updated')
                    }
                })
                .catch(this.handleErrorResponse.bind(null, res))
        } else if (req.body.order_type === 'RETURN') {
            const data = {
                transaction_value: req.body.transaction_value,
                transaction_details: req.body.transaction_details
            }
            this._db.Sales_return.salesUpdate(data, req.params.id)
                .then((data) => {
                    if (data) {
                        res.json('data updated')
                    } else {
                        throw new Error('Data Not Updated')
                    }
                })
                .catch(this.handleErrorResponse.bind(null, res))
        } else {
            res.json({
                status: 0,
                error: ('Invalid type')
            })
        }
    }

    // getting sales data....
    getSales = (req, res) => {
        if (req.params.order_type === 'DELIVERY') {
            this._db.Sales_order.getOrderSales(req.params.id)
                .then((data) => {
                    res.json({
                        data,
                        type: 'DELIVERY'
                    })
                })
        } else if (req.params.order_type === 'RETURN') {
            this._db.Sales_return.getReturnSales(req.params.id)
                .then((data) => {
                    res.json({
                        data,
                        type: 'RETURN'
                    })
                })
        } else if (req.params.order_type === 'DELIVERY_RETURN') {
            this._db.Sales_order.getOrderSales(req.params.id)
                .then((data) => {
                    if (data) {
                        this._db.Sales_return.getReturnSales(req.params.id)
                            .then((return_data) => {
                                if (return_data) {
                                    const sales_data = {
                                        sales_order: data,
                                        sales_return: return_data
                                    }
                                    res.json({
                                        data: sales_data,
                                        type: 'DELIVERY & RETURN'
                                    })
                                } else {
                                    res.json({
                                        status: 0,
                                        error: 'Return Order Data Not Found'
                                    })
                                }
                            })
                    } else {
                        res.json({
                            status: 0,
                            error: 'Sales Order Data Not Found'
                        })
                    }
                })
        }
    }

    // sales save....
    salesCommit = (req, res) => {
            this._db.Sales.Update({ status: 'ACTIVE' }, { where: { report_id: req.params.id } })
                .then((data) => {
                    if (data === 1) {
                        res.json('sales data is active')
                    } else {
                        res.json({
                            status: 0,
                            error: ('Report is not updated')
                        })
                    }
                })
                .catch(this.handleErrorResponse.bind(null, res))
        }
        // report save...
    reportSave = (req, res) => {
        this._db.Report.create(req.body)
            .then(res.json.bind(res))
            .catch(this.handleErrorResponse.bind(null, res))
    }

    // sales rollback
    salesRollback = (req, res) => {
        if (req.params.type === 'DELIVERY') {
            this._db.Sales_order.destroy({ where: { report_id: req.params.id } })
                .then((data) => {
                    if (data) {
                        this._db.Report.update({ rollback_by: req.id }, { where: { id: req.params.id } })
                            .then((data) => {
                                if (data) {
                                    res.json('data is rollback')
                                } else {
                                    throw new Error('Data Is Not Rollback')
                                }
                            })
                            .catch(this.handleErrorResponse.bind(null, res))
                    } else {
                        throw new Error('Data Is Not Rollback')
                    }
                })
                .catch(this.handleErrorResponse.bind(null, res))
        } else if (req.params.type === 'RETURN') {
            this._db.Sales_return.destroy({ where: { report_id: req.params.id } })
                .then((data) => {
                    if (data) {
                        this._db.Report.update({ rollback_by: req.id }, { where: { id: req.params.id } })
                            .then((data) => {
                                if (data) {
                                    res.json('data is rollback')
                                } else {
                                    res.json({
                                        status: 0,
                                        error: 'data is not rollback'
                                    })
                                }
                            })
                            .catch(this.handleErrorResponse.bind(null, res))
                    } else {
                        res.json({
                            status: 0,
                            error: 'data is not rollback'
                        })
                    }
                })
                .catch(this.handleErrorResponse.bind(null, res))
        } else if (req.params.type === 'DELIVERY_RETURN') {
            this._db.Sales_order.destroy({ where: { report_id: req.params.id } })
                .then(() => this._db.Sales_return.destroy({ where: { report_id: req.params.id } }))
                .then((data) => {
                    if (data) {
                        this._db.Report.update({ rollback_by: req.id }, { where: { id: req.params.id } })
                            .then((data) => {
                                if (data) {
                                    res.json('data is rollback')
                                } else {
                                    throw new Error('Data Is Not Rollback')
                                }
                            })
                            .catch(this.handleErrorResponse.bind(null, res))
                    } else {
                        throw new Error('Data Is Not Rollback')
                    }
                })
                .catch(this.handleErrorResponse.bind(null, res))
        } else {
            res.json({
                status: 0,
                error: 'Invalid Type'
            })
        }
    }

    // get report data
    getReport = (req, res) => {
        this._db.Report.getReport()
            .then((data) => {
                if (!data) {
                    throw new Error('Report Not Found')
                } else {
                    res.json(data)
                }
            })
            .catch(this.handleErrorResponse.bind(null, res))
    }
}

const controller = new BrandController()
export default controller
