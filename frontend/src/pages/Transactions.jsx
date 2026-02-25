import { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { Tags, Trash2, Filter } from 'lucide-react';

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
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Transactions</h1>
                    <p className="text-text-secondary mt-1">Review all your past expenses</p>
                </div>
                <button className="btn-outline flex items-center">
                    <Filter size={20} className="mr-2" /> <span>Filter</span>
                </button>
            </div>

            <div className="glass-card mb-8 p-1">
                {transactions.length > 0 ? (
                    <div className="space-y-1">
                        {transactions.map((tx) => (
                            <div key={tx._id} className="group flex flex-col sm:flex-row justify-between sm:items-center p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/5 transition-all">
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
                                    <button
                                        onClick={() => handleDelete(tx._id)}
                                        className="text-text-secondary hover:text-warning p-2 rounded-lg hover:bg-warning/10 transition-colors"
                                        title="Delete Expense"
                                    >
                                        <Trash2 size={20} />
                                    </button>
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
        </Layout>
    );
};

export default Transactions;
