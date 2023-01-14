const { Categories } = require('../model/model')

const categoryController = {

    // get all categories
    findAll: async (req, res) => {
        try {
            if (req.query.page || req.query.limit) {
                const categories = await Categories.paginate({}, {
                    page: req.query.page || 1,
                    limit: req.query.limit || 10,
                    sort: {
                        createdAt: -1
                    }
                })

                const { docs, ...others } = categories
                res.status(200).json({
                    data: docs,
                    ...others
                })
            } else {
                const categories = await Categories.find({}).sort({
                    createdAt: -1
                })
                res.status(200).json(categories)
            }
        } catch (error) {
            res.status(500).json({
                errorMessage: errorMessage
            })
        }
    },

    // get a category
    findId: async (req, res) => {
        try {
            const category = await Categories.findById(req.params.id).populate('products')
            if (category) {
                res.status(200).json(category)
            } else {
                res.status(404).json({
                    errorMessage: 'Category not found!'
                })
            }
        } catch (error) {
            res.status(500).json({
                errorMessage: errorMessage
            })
        }
    },

    // search name category 
    searchByName: async (req, res) => {
        try {
            const name = req.query.name
            const check = RegExp(name, 'i')
            const categories = await Categories.find({ name: check }).populate('products').exec()
            if (categories) {
                res.status(200).json(categories)
            } else {
                res.status(404).json({
                    errorMessage: 'Category name not found!'
                })
            }
        } catch (error) {
            res.status(500).json({
                errorMessage: errorMessage
            })
        }
    }
    ,
    // add category
    addCategory: async (req, res) => {
        try {
            const category = await Categories.create(req.body)
            res.status(200).json({ 
                message: 'Category add successful!'
            })
        } catch (error) {
            res.status(500).json({
                errorMessage: 'Add category failed!'
            })
        }
    },

    // update category
    updateCategory: async (req, res) => {
        try {
            const category = await Categories.findById(req.params.id)
            await category.updateOne({ $set: req.body })
            if (category) {
                res.status(200).json({
                    message: 'Update category successful!'
                })
            } else {
                res.status(404).json({
                    errorMessage: 'Category not found!',
                });
            }
        } catch (error) {
            res.status(500).json({
                errorMessage: 'Update category failed!'
            })
        }
    },

    // delete category
    deleteCategory: async (req, res) => {
        try {
            const category = await Categories.findById(req.params.id)
            if (category) {
                if (category.get('products').length > 0) {
                    res.status(400).json({
                        errorMessage: 'Category has products!'
                    })
                } else {
                    await category.remove()
                    res.status(200).json({
                        message: 'Deleted the category successfully!'
                    })
                }
            }
        } catch (error) {
            res.status(500).json({
                errorMessage: 'Delete category failed!'
            })
        }
    }
}

module.exports = categoryController