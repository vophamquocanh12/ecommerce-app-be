const { Users} = require('../model/model')

const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userController = {
    
    login: async (req, res) => {
        try {
            const { email, password } = req.body
            const user = await Users.findOne({ email })
            const username = user.get('username')

            if (!user) {
                res.status(200).json({
                    message: 'Account does not exist!',
                })
            } else {
                const validPassword = await bcrypt.compare(
                    password,
                    user.password,
                )
                if (!validPassword) {
                    res.status(200).json({
                        message: 'Incorrect password!',
                    })
                } else {
                    res.status(200).json({
                        message: 'Logged in successfully. Hello ' + username,
                    })
                }
            }
        } catch (error) {
            res.status(500).json({
                errorMessage: errorMessage,
            })
        }
    },

    register: async (req, res) => {
        try {
            const { username, email, password, confirmPassword } = req.body

            if (!username || !password) {
                res.status(400).json({
                    message: 'Missing username and/or password!',
                })
            }

            const existEmail = await Users.findOne({ email })
            if (existEmail) {
                res.status(400).json({
                    errorMessage: 'Email already taken!',
                })
            } else if (password !== confirmPassword) {
                res.status(400).json({
                    errorMessage: 'Confirm password do not match!',
                })
            }

            console.log(existEmail)
            console.log(password)
            console.log(confirmPassword)

            if (req.body.password) {
                const salt = 10
                const hash = bcrypt.hashSync(req.body.password, salt)
                req.body.password = hash
            }
            const user = new Users(req.body)
            const result = await user.save()
            res.status(200).json({
                message: 'User registered successfully!',
            })
        } catch (error) {
            res.status(403).json({
                errorMessage: 'User registration failed!',
            })
        }
    },
}

module.exports = userController
