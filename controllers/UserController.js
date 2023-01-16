const { Users } = require('../model/model')
const bcrpyt = require('bcrypt')

const userController = {
    login: async (req, res) => {
        try {
            const { email, password } = req.body
            const user = await Users.findOne({ email: email })

            if (!email || !password) {
                res.status(400).json({
                    message: 'Missing email and/or password!',
                })
            }else if (!user) {
                res.status(401).json({
                    message: 'Account does not exist!',
                })
            }else {
                const validPassword = await bcrpyt.compare(password, user.password)
                if (!validPassword) {
                    res.status(401).json({
                        message: 'Incorrect password!',
                    })
                } else {
                    res.status(200).json({
                        message: 'Logged in successfully. Hello '+user.username+'!',
                    })
                }
            }
        } catch (error) {
            res.status(403).json({
                errorMessage: 'Login failed!',
            })
        }
    },

    register: async (req, res) => {
        try {
            const { username, email, password, confirmPassword } = req.body
            const existEmail = await Users.findOne({ email })

            if (!username || !password) {
                res.status(400).json({
                    message: 'Missing username and/or password!',
                })
            } else if(!confirmPassword){
                res.status(400).json({
                    message: 'Missing confirm password!',
                })
            }else if (existEmail) {
                res.status(409).json({
                    errorMessage: 'Email already taken!',
                })
            } else if (password !== confirmPassword) {
                res.status(401).json({
                    errorMessage: 'Confirm password do not match!',
                })
            } else {
                const salt = 10
                const hash = bcrpyt.hashSync(req.body.password, salt)
                req.body.password = hash

                const user = new Users(req.body)
                await user.save()
                res.status(201).json({
                    message: 'User registered successfully!',
                })
            }
        } catch (error) {
            res.status(403).json({
                errorMessage: 'User registration failed!',
            })
        }
    },
}

module.exports = userController
