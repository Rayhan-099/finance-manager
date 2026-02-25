import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { X, Camera, Loader2, CheckCircle2 } from 'lucide-react';

const CATEGORIES = ['Food & Dining', 'Transportation', 'Housing', 'Utilities', 'Entertainment', 'Shopping', 'Health', 'Other'];

const AddExpenseModal = ({ isOpen, onClose, onSuccess, initialData = null }) => {
    const { user } = useContext(AuthContext);
    const allCategories = [...CATEGORIES, ...(user?.customCategories || [])];

    const [formData, setFormData] = useState({ amount: '', category: allCategories[0], description: '', date: new Date().toISOString().split('T')[0] });
    const [loading, setLoading] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [scanSuccess, setScanSuccess] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setFormData({
                    amount: initialData.amount,
                    category: initialData.category,
                    description: initialData.description || '',
                    date: new Date(initialData.date).toISOString().split('T')[0]
                });
                setFormData({ amount: '', category: allCategories[0], description: '', date: new Date().toISOString().split('T')[0] });
                setScanSuccess(false);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, initialData, allCategories[0]]);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (initialData) {
                await axios.put(`/api/expenses/${initialData._id}`, {
                    amount: Number(formData.amount),
                    category: formData.category,
                    description: formData.description,
                    date: formData.date
                });
            } else {
                await axios.post('/api/expenses', {
                    amount: Number(formData.amount),
                    category: formData.category,
                    description: formData.description,
                    date: formData.date
                });
            }
            onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsScanning(true);
        setScanSuccess(false);
        const data = new FormData();
        data.append('receipt', file);

        try {
            const res = await axios.post('/api/ai/scan-receipt', data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            // Update form with AI extracted data
            setFormData(prev => ({
                ...prev,
                amount: res.data.amount || prev.amount,
                description: res.data.description || prev.description,
                date: res.data.date || prev.date,
                category: res.data.category && allCategories.includes(res.data.category)
                    ? res.data.category
                    : prev.category
            }));
            setScanSuccess(true);

            // clear success message after 3 seconds
            setTimeout(() => setScanSuccess(false), 3000);
        } catch (err) {
            console.error('Failed to scan receipt:', err);
            alert(err.response?.data?.msg || 'Failed to scan receipt');
        } finally {
            setIsScanning(false);
            // reset file input
            e.target.value = null;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
            <div className="glass-card w-full max-w-md relative animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute right-4 top-4 text-text-secondary hover:text-text-main transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">{initialData ? 'Edit Expense' : 'Add New Expense'}</h2>

                    {!initialData && (
                        <div className="relative">
                            <input
                                type="file"
                                id="receipt-upload"
                                accept="image/*"
                                className="hidden"
                                onChange={handleFileUpload}
                                disabled={isScanning}
                            />
                            <label
                                htmlFor="receipt-upload"
                                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${isScanning
                                        ? 'bg-indigo-500/20 text-indigo-400 cursor-not-allowed'
                                        : scanSuccess
                                            ? 'bg-success/20 text-success'
                                            : 'bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20'
                                    }`}
                            >
                                {isScanning ? (
                                    <><Loader2 size={16} className="animate-spin" /> Scanning...</>
                                ) : scanSuccess ? (
                                    <><CheckCircle2 size={16} /> Auto-filled!</>
                                ) : (
                                    <><Camera size={16} /> AI Scan</>
                                )}
                            </label>
                        </div>
                    )}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-text-secondary">Amount (₹)</label>
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
                        <label className="block text-sm font-medium mb-1 text-text-secondary">Category</label>
                        <select
                            className="input-field"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                            {allCategories.map(cat => <option key={cat} value={cat} className="bg-background">{cat}</option>)}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-text-secondary">Date</label>
                        <input
                            type="date"
                            required
                            className="input-field"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1 text-text-secondary">Description (Optional)</label>
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
                            {loading ? 'Saving...' : (initialData ? 'Update Expense' : 'Save Expense')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddExpenseModal;
