const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/user');

router.post('/signup', (req, res, next) => {

    User.find({
            email: req.body.email
        })
        .exec()
        .then(test => {
            if (test.length >= 1) {
                return res.status(409).json({
                    message: "Email already used!"
                })
            } else {
                bcrypt.hash(req.body.password, 10, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            error: err
                        })
                    } else {
                        const user = new User({
                            _id: new mongoose.Types.ObjectId,
                            email: req.body.email,
                            password: hash
                        });
                        user.save()
                            .then(result => {
                                console.log(user);
                                res.status(201).json({
                                    message: 'User created!'
                                })
                            })
                            .catch(err => {
                                res.status(500).json({
                                    error: 'aici'
                                })
                            })
                    }
                })
            }
        })
})



router.delete('/:userId', (req, res, netx) => {
    const id = req.params.userId;
    User.deleteOne({
            _id: id
        })
        .exec()
        .then(result => {
            res.status(200).json({
                message: 'User deleted'
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})

module.exports = router;