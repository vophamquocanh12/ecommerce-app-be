const mongoose = require('mongoose')
const slug = require('mongoose-slug-generator')

const Categories = require('./Categories')
const Trademarks = require('./Trademarks')
const Products = require('./Products')
const ProductDetails = require('./ProductDetails')
const Sizes = require('./Size')
const BillDetails = require('./BillDetails')
const Bills = require('./Bills')
const Users = require('./Users')

module.exports = { Categories, Trademarks, Products, ProductDetails, Sizes, BillDetails, Bills, Users }