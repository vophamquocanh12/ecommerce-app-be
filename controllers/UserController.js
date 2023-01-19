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
            } else if (!user) {
                res.status(401).json({
                    message: 'Account does not exist!',
                })
            } else {
                const validPassword = await bcrpyt.compare(
                    password,
                    user.password,
                )
                if (!validPassword) {
                    res.status(401).json({
                        message: 'Incorrect password!',
                    })
                } else {
                    res.status(200).json({
                        message:
                            'Logged in successfully. Hello ' +
                            user.username +
                            '!',
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
            } else if (!confirmPassword) {
                res.status(400).json({
                    message: 'Missing confirm password!',
                })
            } else if (existEmail) {
                res.status(409).json({
                    message: 'Email already taken!',
                })
            } else if (password !== confirmPassword) {
                res.status(401).json({
                    message: 'Confirm password do not match!',
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

    updateUser: async (req, res) => {
        try {
            if (req.body.password) {
                const hased = bcrpyt.hashSync(req.body.password, 10)
                req.body.password = hased
            }
            const user = await Users.findById(req.params.id)
            if (!user) {
                res.status(404).json({
                    message: 'Not found!',
                })
            } else {
                await Users.findByIdAndUpdate(req.params.id, req.body, {
                    new: true,
                })
                res.status(200).json({
                    message: 'User updated successful!',
                })
            }
        } catch (error) {
            res.status(500).json({
                errorMessage: 'Update user failed!',
            })
        }
    },

    deleteUser: async (req, res) => {
        try {
            const user = await Users.findById(req.params.id)
            if (!user) {
                res.status(404).json({
                    message: 'Not found!',
                })
            } else {
                if (
                    user.get('comments').length > 0 ||
                    user.get('bills').length > 0
                ) {
                    res.status(400).json({
                        message: 'User has comments or bills',
                    })
                } else {
                    await Users.findByIdAndDelete(req.params.id)
                    res.status(200).json({
                        message: 'Deleted the user successful!',
                    })
                }
            }
        } catch (error) {
            res.status(500).json({
                errorMessage: 'Delete user failed!',
            })
        }
    },

    getById: async (req, res) => {
        try {
            const user = await Users.findById(req.params.id)
            if (user) {
                res.status(200).json(user)
            } else {
                res.status(404).json({
                    message: 'User not found!',
                })
            }
        } catch (error) {
            res.status(500).json({
                errorMessage: error,
            })
        }
    },

    getAll: async (req, res) => {
        try {
            if (req.query.page || req.query.limit) {
                const users = await Users.paginate(
                    {},
                    {
                        page: req.query.page || 1,
                        limit: req.limit || 10,
                        sort: {
                            createdAt: -1,
                        },
                    },
                )

                const { docs, ...others } = users
                res.status(200).json({
                    data: docs,
                    ...others,
                })
            } else {
                const users = await Users.find().sort({
                    createdAt: -1,
                })
                res.status(200).json({
                    data: users
                })
            }
        } catch (error) {
            res.status(500).json({
                errorMessage: error,
            })
        }
    },

    getAllAdmin: async (req, res) => {
        try {
            if (req.query.page || req.query.limit) {
                const users = await Users.paginate(
                    { isAdmin: 1 },
                    {
                        page: req.query.page || 1,
                        limit: req.limit || 10,
                        sort: {
                            createdAt: -1,
                        },
                    },
                )

                const { docs, ...others } = users
                res.status(200).json({
                    data: docs,
                    ...others,
                })
            } else {
                const users = await Users.find({ isAdmin: 1 }).sort({
                    createdAt: -1,
                })
                res.status(200).json({
                    data: users,
                })
            }
        } catch (error) {
            res.status(500).json({
                errorMessage: error,
            })
        }
    },

    getAllCustomers: async (req, res) => {
        try {
            if (req.query.page || req.query.limit) {
                const users = await Users.paginate(
                    { isCustomer: 1 },
                    {
                        page: req.query.page || 1,
                        limit: req.limit || 10,
                        sort: {
                            createdAt: -1,
                        },
                    },
                )

                const { docs, ...others } = users
                res.status(200).json({
                    data: docs,
                    ...others,
                })
            } else {
                const users = await Users.find({ isCustomer: 1 }).sort({
                    createdAt: -1,
                })
                res.status(200).json({
                    data: users,
                })
            }
        } catch (error) {
            res.status(500).json({
                errorMessage: error,
            })
        }
    },

    getAllProviders: async (req, res) => {
        try {
            if (req.query.page || req.query.limit) {
                const users = await Users.paginate(
                    { isProvider: 1 },
                    {
                        page: req.query.page || 1,
                        limit: req.limit || 10,
                        sort: {
                            createdAt: -1,
                        },
                    },
                )

                const { docs, ...others } = users
                res.status(200).json({
                    data: docs,
                    ...others,
                })
            } else {
                const users = await Users.find({ isProvider: 1 }).sort({
                    createdAt: -1,
                })
                res.status(200).json({
                    data: users,
                })
            }
        } catch (error) {
            res.status(500).json({
                errorMessage: error,
            })
        }
    },

    searchByNameCustomers: async (req, res) => {
        try {
            const name = req.query.name
            const check = RegExp(name, 'i')
            const customers = await Users.find({
                username: check,
                isCustomer: 1,
            }).exec()
            if (customers) {
                res.status(200).json(customers)
            } else {
                res.status(404).json({
                    message: 'Customer name not found!',
                })
            }
        } catch (error) {
            res.status(500).json({
                errorMessage: error,
            })
        }
    },

    searchByNameProviders: async (req, res) => {
        try {
            const name = req.query.name
            const check = RegExp(name, 'i')
            const providers = await Users.find({
                username: check,
                isProvider: 1,
            })
            if (providers) {
                res.status(200).json(providers)
            } else {
                res.status(404).json({
                    message: 'Provider name not found!',
                })
            }
        } catch (error) {
            res.status(500).json({
                errorMessage: error,
            })
        }
    },
}

module.exports = userController
