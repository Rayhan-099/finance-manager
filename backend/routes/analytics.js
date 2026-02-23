const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Expense = require('../models/Expense');

// @route   GET api/analytics/dashboard
// @desc    Get dashboard stats (total spend this month, category breakdown)
// @access  Private
router.get('/dashboard', auth, async (req, res) => {
    try {
        const expenses = await Expense.find({ user: req.user.id });

        // Calculate total spend
        let totalSpend = 0;
        expenses.forEach(exp => {
            totalSpend += exp.amount;
        });

        // Calculate spend per category
        const categoryBreakdown = {};
        expenses.forEach(exp => {
            if (!categoryBreakdown[exp.category]) {
                categoryBreakdown[exp.category] = 0;
            }
            categoryBreakdown[exp.category] += exp.amount;
        });

        const categories = Object.keys(categoryBreakdown).map(key => ({
            name: key,
            value: categoryBreakdown[key]
        }));

        res.json({
            totalSpend,
            categoryBreakdown: categories
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
