import { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { Tags, Trash2 } from 'lucide-react';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) {
        return <Layout><div className="flex h-full items-center justify-center">Loading Data...</div></Layout>;
    }

    return (
        <Layout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold">All Transactions</h1>
                <p className="text-textSecondary mt-1">Detailed history of all your expenses</p>
            </div>

            <div className="glass-card">
                {transactions.length > 0 ? (
                    <div className="space-y-4">
                        {transactions.map((tx) => (
                            <div key={tx._id} className="flex justify-between items-center p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(222,225,229,0.05)] hover:bg-[rgba(255,255,255,0.04)] transition-colors">
                                <div className="flex items-center">
                                    <div className="w-12 h-12 rounded-full bg-primary/20 text-primary flex items-center justify-center mr-4">
                                        <Tags size={20} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg text-textMain">{tx.description || tx.category}</p>
                                        <p className="text-sm text-textSecondary">{new Date(tx.date).toLocaleDateString()} • {tx.category}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 text-right">
                                    <p className="font-mono font-bold text-xl text-warning">-₹{tx.amount}</p>
                                    <button
                                        onClick={() => handleDelete(tx._id)}
                                        className="p-2 text-textSecondary hover:text-warning hover:bg-warning/10 rounded-lg transition-colors"
                                        title="Delete Expense"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-textSecondary">
                        <Tags size={48} className="mx-auto mb-4 opacity-50" />
                        <p className="text-lg">No transactions found</p>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Transactions;
