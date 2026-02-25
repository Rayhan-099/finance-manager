import { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import AddExpenseModal from '../components/AddExpenseModal';
import { Tags, Trash2, Edit2, Download } from 'lucide-react';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [expenseToEdit, setExpenseToEdit] = useState(null);
    const [filterCategory, setFilterCategory] = useState('All');
    const [sortBy, setSortBy] = useState('date_desc');

    const CATEGORIES = ['Food & Dining', 'Transportation', 'Housing', 'Utilities', 'Entertainment', 'Shopping', 'Health', 'Other'];

    const fetchTransactions = async () => {
        try {
            const res = await axios.get('/api/expenses');
            setTransactions(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this expense?')) {
            try {
                await axios.delete(`/api/expenses/${id}`);
                setTransactions(transactions.filter(t => t._id !== id));
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleEdit = (tx) => {
        setExpenseToEdit(tx);
        setIsEditModalOpen(true);
    };

    const filteredTransactions = transactions
        .filter(tx => filterCategory === 'All' || tx.category === filterCategory)
        .sort((a, b) => {
            if (sortBy === 'date_desc') return new Date(b.date) - new Date(a.date);
            if (sortBy === 'date_asc') return new Date(a.date) - new Date(b.date);
            if (sortBy === 'amount_desc') return b.amount - a.amount;
            if (sortBy === 'amount_asc') return a.amount - b.amount;
            return 0;
        });

    const downloadCSV = () => {
        const headers = ['Date', 'Category', 'Description', 'Amount'];
        // Adding UTF-8 BOM (\uFEFF) to ensure Excel opens it properly
        const csvContent = '\uFEFF' + [
            headers.join(','),
            ...filteredTransactions.map(tx => [
                new Date(tx.date).toLocaleDateString(),
                `"${tx.category}"`,
                `"${(tx.description || '').replace(/"/g, '""')}"`, // escape quotes within description
                tx.amount
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'transactions.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) {
        return <Layout><div className="flex h-full items-center justify-center">Loading Data...</div></Layout>;
    }

    return (
        <Layout>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Transactions</h1>
                    <p className="text-text-secondary mt-1">Review all your past expenses</p>
                </div>
                <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                    <select
                        className="input-field py-2 text-sm min-w-[150px]"
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                    >
                        <option value="All" className="bg-background">All Categories</option>
                        {CATEGORIES.map(cat => (
                            <option key={cat} value={cat} className="bg-background">{cat}</option>
                        ))}
                    </select>

                    <select
                        className="input-field py-2 text-sm min-w-[160px]"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                    >
                        <option value="date_desc" className="bg-background">Date (Newest)</option>
                        <option value="date_asc" className="bg-background">Date (Oldest)</option>
                        <option value="amount_desc" className="bg-background">Amount (Highest)</option>
                        <option value="amount_asc" className="bg-background">Amount (Lowest)</option>
                    </select>

                    <button
                        onClick={downloadCSV}
                        className="btn-outline flex items-center py-2"
                        title="Export to CSV"
                    >
                        <Download size={18} className="mr-2 sm:hidden md:block lg:mr-2" /> <span className="hidden lg:block">Export</span>
                    </button>
                </div>
            </div>

            <div className="glass-card mb-8 p-1">
                {filteredTransactions.length > 0 ? (
                    <div className="space-y-1">
                        {filteredTransactions.map((tx) => (
                            <div key={tx._id} className="group flex flex-col sm:flex-row justify-between sm:items-center p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 hover:bg-black/10 dark:hover:bg-white/10 transition-all">
                                <div className="flex items-center mb-3 sm:mb-0">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-4 group-hover:bg-primary group-hover:text-white transition-colors">
                                        <Tags size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-text-main text-lg">{tx.description || tx.category}</p>
                                        <p className="text-sm text-text-secondary">{new Date(tx.date).toLocaleDateString()} • {tx.category}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto">
                                    <p className="font-mono font-bold text-warning text-lg mr-6">-₹{tx.amount}</p>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => handleEdit(tx)}
                                            className="text-text-secondary hover:text-primary p-2 rounded-lg hover:bg-primary/10 transition-colors"
                                            title="Edit Expense"
                                        >
                                            <Edit2 size={20} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(tx._id)}
                                            className="text-text-secondary hover:text-warning p-2 rounded-lg hover:bg-warning/10 transition-colors"
                                            title="Delete Expense"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-text-secondary">
                        <Tags size={48} className="mx-auto mb-4 opacity-50" />
                        <p className="text-lg">No transactions found</p>
                    </div>
                )}
            </div>

            <AddExpenseModal
                isOpen={isEditModalOpen}
                onClose={() => {
                    setIsEditModalOpen(false);
                    setExpenseToEdit(null);
                }}
                onSuccess={fetchTransactions}
                initialData={expenseToEdit}
            />
        </Layout>
    );
};

export default Transactions;
