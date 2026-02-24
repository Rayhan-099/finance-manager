import { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { X } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const SetBudgetModal = ({ isOpen, onClose, onSuccess }) => {
    const { user, fetchUser } = useContext(AuthContext);
    const [monthlyBudget, setMonthlyBudget] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user && user.monthlyBudget) {
            setMonthlyBudget(user.monthlyBudget);
        }
    }, [user]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.put('/api/auth/budget', {
                monthlyBudget: Number(monthlyBudget),
            });
            await fetchUser(); // Update global auth context
            onSuccess();
            onClose();
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

                <h2 className="text-2xl font-bold mb-6">Set Monthly Budget</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-textSecondary">Amount (₹)</label>
                        <input
                            type="number"
                            required
                            min="0"
                            step="1"
                            className="input-field font-mono text-lg"
                            value={monthlyBudget}
                            onChange={(e) => setMonthlyBudget(e.target.value)}
                            placeholder="e.g 5000"
                            autoFocus
                        />
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button type="button" onClick={onClose} className="btn-outline">Cancel</button>
                        <button type="submit" className="btn-primary" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Budget'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SetBudgetModal;
