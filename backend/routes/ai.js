const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Expense = require('../models/Expense');
const User = require('../models/User');
const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// @route   GET api/ai/insights
// @desc    Get tailored financial advice from Gemini API
// @access  Private
router.get('/insights', auth, async (req, res) => {
    try {
        // Fetch user data securely
        const user = await User.findById(req.user.id).select('-password');

        // Fetch last 30 days of expenses
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentExpenses = await Expense.find({
            user: req.user.id,
            date: { $gte: thirtyDaysAgo }
        }).sort({ date: -1 });

        if (recentExpenses.length === 0) {
            return res.json({
                insight: "It looks like you haven't logged any expenses recently. Start logging your daily spending so I can provide personalized financial advice and saving strategies!"
            });
        }

        // Calculate total spend and category breakdown
        let totalSpend = 0;
        const categoryTotals = {};

        recentExpenses.forEach(expense => {
            totalSpend += expense.amount;
            categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
        });

        // Format the data prompt for Gemini
        const systemPrompt = `You are an expert, highly intelligent, and slightly nonchalant financial advisor AI for an app called "Current Capital". 
Your goal is to provide concise, actionable, and visually clean financial advice. Provide your response in Markdown. Use bullet points and bold text where necessary.
Keep the advice under 4 paragraphs. Be encouraging but realistic.`;

        const userDataPrompt = `
User Profile:
- Monthly Budget: ₹${user.monthlyBudget || "Not set"}
- Total Spent Last 30 Days: ₹${totalSpend}
- Configured Custom Categories: ${user.customCategories.join(', ') || "None"}

Spending Breakdown (Last 30 Days):
${Object.entries(categoryTotals).map(([cat, amount]) => `- ${cat}: ₹${amount}`).join('\n')}

Based on this real data, generate a personalized financial health report. Point out if they are over budget, highlight their highest spending category, and offer 2-3 specific, actionable tips to save money or optimize their spending.`;

        // Call Gemini
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `${systemPrompt}\n\n${userDataPrompt}`,
        });

        res.json({ insight: response.text });

    } catch (err) {
        console.error('Gemini API Error:', err);
        res.status(500).json({ msg: 'Failed to generate AI insights due to a server error. Please try again later.' });
    }
});

module.exports = router;
