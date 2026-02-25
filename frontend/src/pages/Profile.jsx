import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import Layout from '../components/Layout';
import axios from 'axios';
import { UserCircle, Tags as TagsIcon, Plus, X, Wallet } from 'lucide-react';

const CATEGORIES = ['Food & Dining', 'Transportation', 'Housing', 'Utilities', 'Entertainment', 'Shopping', 'Health', 'Other'];

const Profile = () => {
    const { user, fetchUser } = useContext(AuthContext);
    const [name, setName] = useState(user?.name || '');
    const [customCategories, setCustomCategories] = useState(user?.customCategories || []);
    const [newCategory, setNewCategory] = useState('');
    const [categoryBudgets, setCategoryBudgets] = useState(user?.categoryBudgets || []);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user) {
            setName(user.name);
            setCustomCategories(user.customCategories || []);
            setCategoryBudgets(user.categoryBudgets || []);
        }
    }, [user]);

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            await axios.put('/api/auth/profile', { name });
            await fetchUser(); // Refresh user context
            setMessage('Profile updated successfully.');
        } catch (err) {
            console.error(err);
            setMessage('Error updating profile.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddCategory = async (e) => {
        e.preventDefault();
        if (!newCategory.trim()) return;
        if (customCategories.includes(newCategory.trim())) {
            setMessage('Category already exists.');
            return;
        }

        const updatedCategories = [...customCategories, newCategory.trim()];
        setLoading(true);
        try {
            await axios.put('/api/auth/profile', { customCategories: updatedCategories });
            await fetchUser();
            setNewCategory('');
            setMessage('Category added.');
        } catch (err) {
            console.error(err);
            setMessage('Error adding category.');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveCategory = async (categoryToRemove) => {
        const updatedCategories = customCategories.filter(c => c !== categoryToRemove);
        setLoading(true);
        try {
            await axios.put('/api/auth/profile', { customCategories: updatedCategories });
            await fetchUser();
            setMessage('Category removed.');
        } catch (err) {
            console.error(err);
            setMessage('Error removing category.');
        } finally {
            setLoading(false);
        }
    };

    const handleSaveBudgets = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            await axios.put('/api/auth/profile', { categoryBudgets });
            await fetchUser();
            setMessage('Category budgets updated successfully.');
        } catch (err) {
            console.error(err);
            setMessage('Error updating category budgets.');
        } finally {
            setLoading(false);
        }
    };

    const handleBudgetChange = (category, limit) => {
        setCategoryBudgets(prev => {
            const existing = prev.find(b => b.category === category);
            if (existing) {
                return prev.map(b => b.category === category ? { ...b, limit: Number(limit) } : b);
            } else {
                return [...prev, { category, limit: Number(limit) }];
            }
        });
    };

    const allCategories = [...CATEGORIES, ...customCategories];

    return (
        <Layout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold">User Profile</h1>
                <p className="text-text-secondary mt-1">Manage your account and preferences</p>
            </div>

            {message && (
                <div className="w-full bg-primary/20 border border-primary text-primary px-4 py-3 rounded-lg mb-6">
                    {message}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Profile Details */}
                <div className="glass-card">
                    <div className="flex items-center mb-6 text-primary">
                        <UserCircle size={24} className="mr-2" />
                        <h2 className="text-xl font-bold text-text-main">Personal Details</h2>
                    </div>
                    <form onSubmit={handleSaveProfile} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-text-secondary">Full Name</label>
                            <input
                                type="text"
                                className="input-field"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-text-secondary">Email Address (Read Only)</label>
                            <input
                                type="email"
                                className="input-field opacity-50 cursor-not-allowed"
                                value={user?.email || ''}
                                disabled
                            />
                        </div>
                        <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
                            {loading ? 'Saving...' : 'Update Profile'}
                        </button>
                    </form>
                </div>

                {/* Custom Categories */}
                <div className="glass-card">
                    <div className="flex items-center mb-6 text-primary">
                        <TagsIcon size={24} className="mr-2" />
                        <h2 className="text-xl font-bold text-text-main">Custom Categories</h2>
                    </div>
                    <p className="text-sm text-text-secondary mb-6">Add your own categories to personalize your expense tracking.</p>

                    <form onSubmit={handleAddCategory} className="flex gap-2 mb-6">
                        <input
                            type="text"
                            placeholder="E.g., Gaming, Pets"
                            className="input-field py-2"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                        />
                        <button type="submit" disabled={loading || !newCategory.trim()} className="btn-primary flex items-center px-4">
                            <Plus size={20} />
                        </button>
                    </form>

                    <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                        {customCategories.length > 0 ? (
                            customCategories.map((cat, idx) => (
                                <div key={idx} className="flex justify-between items-center p-3 rounded-lg bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 group">
                                    <span className="font-medium text-text-main">{cat}</span>
                                    <button
                                        onClick={() => handleRemoveCategory(cat)}
                                        className="text-text-secondary hover:text-warning p-1 rounded transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                                        title="Remove category"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-text-secondary italic text-center py-4">No custom categories added yet.</p>
                        )}
                    </div>
                </div>

                {/* Category Budgets */}
                <div className="glass-card md:col-span-2">
                    <div className="flex items-center mb-6 text-primary">
                        <Wallet size={24} className="mr-2" />
                        <h2 className="text-xl font-bold text-text-main">Category Budgets (Envelope System)</h2>
                    </div>
                    <p className="text-sm text-text-secondary mb-6">Set specific monthly spending limits for your categories. Leave at 0 for no limit.</p>

                    <form onSubmit={handleSaveBudgets}>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                            {allCategories.map((cat, idx) => {
                                const currentBudget = categoryBudgets.find(b => b.category === cat)?.limit || '';
                                return (
                                    <div key={idx} className="bg-black/5 dark:bg-white/5 p-3 rounded-lg border border-black/10 dark:border-white/10 flex items-center justify-between">
                                        <span className="font-medium text-text-main text-sm truncate mr-2" title={cat}>{cat}</span>
                                        <div className="flex items-center w-28 flex-shrink-0">
                                            <span className="text-text-secondary mr-2 text-sm">₹</span>
                                            <input
                                                type="number"
                                                min="0"
                                                className="input-field py-1 px-2 text-right text-sm"
                                                placeholder="0"
                                                value={currentBudget}
                                                onChange={(e) => handleBudgetChange(cat, e.target.value)}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="flex justify-end">
                            <button type="submit" disabled={loading} className="btn-primary">
                                {loading ? 'Saving...' : 'Save Category Budgets'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default Profile;
