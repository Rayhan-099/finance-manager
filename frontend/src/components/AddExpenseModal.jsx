import { useState } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';

const CATEGORIES = ['Food & Dining', 'Transportation', 'Housing', 'Utilities', 'Entertainment', 'Shopping', 'Health', 'Other'];

const AddExpenseModal = ({ isOpen, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({ amount: '', category: CATEGORIES[0], description: '', date: new Date().toISOString().split('T')[0] });
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('/api/expenses', {
                amount: Number(formData.amount),
                category: formData.category,
                description: formData.description,
                date: formData.date
            });
            onSuccess();
            onClose();
            setFormData({ amount: '', category: CATEGORIES[0], description: '', date: new Date().toISOString().split('T')[0] });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <div className="glass-card w-full max-w-md relative animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-textSecondary hover:text-textMain transition-colors"
                >
                    <X size={20} />
                </button>

                <h2 className="text-2xl font-bold mb-6">Add New Expense</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-textSecondary">Amount (₹)</label>
                        <input
                            type="number"
                            required
                            min="0"
                            step="0.01"
                            className="input-field font-mono text-lg"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            placeholder="0.00"
                            autoFocus
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-textSecondary">Category</label>
                        <select
                            className="input-field"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                            {CATEGORIES.map(cat => <option key={cat} value={cat} className="bg-background">{cat}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-textSecondary">Date</label>
                        <input
                            type="date"
                            required
                            className="input-field"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-textSecondary">Description (Optional)</label>
                        <input
                            type="text"
                            className="input-field"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="e.g. Uber to work"
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="btn-outline">Cancel</button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Adding...' : 'Save Expense'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddExpenseModal;
