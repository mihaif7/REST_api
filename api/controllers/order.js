const Order = require('../models/order.js');
const Product = require('../models/product');
const mongoose = require('mongoose');

exports.order_get_all = (req, res, next) => {
    Order.find()
        .select('-__v')
        .populate('product', '-__v')
        .exec()
        .then(results => {
            res.status(200).json({
                count: results.length,
                orders: results.map(result => {
                    return {
                        _id: result._id,
                        product: result.product,
                        quantity: result.quantity,
                        request: {
                            type: 'GET',
                            url: 'http://localhost:3000/orders/' + result._id
                        }
                    }
                })
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
}

exports.order_create = (req, res, next) => {
    Product.findById(req.body.productId)
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    message: "Product not found!"
                });
            }
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            });
            return order.save();

        })
        .then(result => {
            console.log(result);
            res.status(201).json({
                message: 'Order stored successfuly',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders/' + result._id
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });

}

exports.order_get_one = (req, res, next) => {
    const orderId = req.params.orderId
    Order.findById(orderId)
        .select('-__v')
        .populate('product', '-__v')
        .exec()
        .then(order => {
            if (!order) {
                return res.status(404).json({
                    message: 'Order not found!'
                })
            }
            res.status(200).json({
                order: order,
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders'
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        });
}

exports.order_delete = (req, res, next) => {
    const orderId = req.params.orderId
    Order.deleteOne({
            _id: orderId
        })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'Order deleted!',
                request: {
                    type: 'GET',
                    url: 'http://localhost:3000/orders'
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
}