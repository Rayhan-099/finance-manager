const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Expense = require('../models/Expense');
const User = require('../models/User');
const multer = require('multer');
const { GoogleGenAI } = require('@google/genai');

const upload = multer({ storage: multer.memoryStorage() });

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

// @route   POST api/ai/scan-receipt
// @desc    Scan a receipt using Gemini Vision and extract data
// @access  Private
router.post('/scan-receipt', [auth, upload.single('receipt')], async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: 'No image file provided' });
        }

        const user = await User.findById(req.user.id).select('customCategories');
        const allCategories = ['Food & Dining', 'Transportation', 'Housing', 'Utilities', 'Entertainment', 'Shopping', 'Health', 'Other', ...(user.customCategories || [])];

        const systemPrompt = `You are a financial receipt parser. Extract the following information from the receipt image:
1. amount (Total amount as a number, e.g., 50.25. Do not include currency symbols)
2. description (Merchant name or brief description, e.g., "Starbucks")
3. date (In YYYY-MM-DD format)
4. category (Must be exactly one of the following: ${allCategories.join(', ')})

Return ONLY a perfectly formatted JSON object with no markdown wrapping, no markdown code blocks, just raw JSON string exactly like this:
{
  "amount": 50.25,
  "description": "Merchant Name",
  "date": "2023-10-25",
  "category": "Food & Dining"
}`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
                systemPrompt,
                {
                    inlineData: {
                        mimeType: req.file.mimetype,
                        data: req.file.buffer.toString('base64')
                    }
                }
            ],
        });

        let text = response.text.trim();
        const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
        if (jsonMatch) {
            text = jsonMatch[1];
        } else {
            const firstBrace = text.indexOf('{');
            const lastBrace = text.lastIndexOf('}');
            if (firstBrace !== -1 && lastBrace !== -1) {
                text = text.substring(firstBrace, lastBrace + 1);
            }
        }

        try {
            const parsedData = JSON.parse(text.trim());
            res.json(parsedData);
        } catch (parseError) {
            console.error('Failed to parse Gemini JSON:', text);
            return res.status(500).json({ msg: 'Could not parse receipt data automatically.' });
        }

    } catch (err) {
        console.error('Gemini Vision API Error:', err);
        res.status(500).json({ msg: 'Failed to scan receipt. Please try again or enter manually.' });
    }
});

module.exports = router;
