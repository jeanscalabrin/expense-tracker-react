const Transaction = require('../models/Transaction')

// @desc  Get all transactions
// @route GET /api/v1/transactions
// @access Public

exports.getTransactions = async (req, res, next) => {
    try {
        const transactions = await Transaction.find()

        return res.status(200).json({
            countTransactions: transactions.length,
            transactions: transactions
        })
    } catch (err) {
        return res.status(500).json({
            error: 'Server Error' 
        })
    }
}

// @desc  Add transaction
// @route POST /api/v1/transactions
// @access Public

exports.addTransaction = async (req, res) => {
    try {
        const { text, amount } = req.body

        if (!text && !amount) {
            throw "Envie os valores corretos de text e amount."
        }

        const transaction = await Transaction.create(req.body)

        return res.status(201).json({
            success: true,
            transaction: transaction
        })
    } catch (err) {
        if(err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message)
            res.status(400).json({
                error: messages
            })
        }else {
            return res.status(500).json({
                error: err
            })
        }
    }
}

exports.getTransactionById = async (req, res) =>  {
    try {

        const { id } = req.params

        if (!id) {
            throw "Envie seu parâmetro ID"
        }

        const transaction = await Transaction.findById(id)

        return res.status(200).json({
            transaction: transaction
        })

    } catch (error) {
        return res.status(500).json({
            Error: error.message
        })
    }
}

// @desc  Delete transaction
// @route DELETE /api/v1/transaction/:id
// @access Public

exports.deleteTransaction = async (req, res, next) => {
    try {
        const transaction = await Transaction.findById(req.params.id)

        if(!transaction) {
            return res.status(404).json({
                success: false,
                error: 'No transaction found'
            })
        }

        await transaction.remove()
        return res.status(200).json({
            success: true,
            data: {}
        })
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: 'Server Error' 
        })
    }
}
