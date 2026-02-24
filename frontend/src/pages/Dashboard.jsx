import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import Layout from '../components/Layout';
import axios from 'axios';
import { Plus, IndianRupee, TrendingUp, Tags, Target } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import AddExpenseModal from '../components/AddExpenseModal';
import SetBudgetModal from '../components/SetBudgetModal';

const COLORS = ['#3A41B2', '#1A1999', '#5E65D7', '#868DF0', '#00C896', '#FF4C61'];

const Dashboard = () => {
    const { user } = useContext(AuthContext);
    const [dashboardData, setDashboardData] = useState({ totalSpend: 0, categoryBreakdown: [] });
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [analyticsRes, expensesRes] = await Promise.all([
                axios.get('/api/analytics/dashboard'),
                axios.get('/api/expenses')
            ]);
            setDashboardData(analyticsRes.data);
            setRecentTransactions(expensesRes.data.slice(0, 5)); // Get 5 most recent
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return (
            <Layout>
                <div className="flex h-full items-center justify-center">Loading Data...</div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Overview</h1>
                    <p className="text-textSecondary mt-1">Hello, {user?.name}. Here's your financial summary.</p>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => setIsBudgetModalOpen(true)} className="btn-outline flex items-center">
                        <Target size={20} className="mr-2" /> <span>Set Budget</span>
                    </button>
                    <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center shadow-primary/20 shadow-lg">
                        <Plus size={20} className="mr-2" /> <span>Add Expense</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                {/* Hero Stat */}
                <div className="glass-card md:col-span-2 flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-primary/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                    <div className="flex items-start">
                        <div className="p-3 rounded-xl bg-surface/50 backdrop-blur-md border border-white/10 mr-4 shadow-lg">
                            <IndianRupee className="text-primary" size={28} />
                        </div>
                        <div>
                            <p className="text-textSecondary font-medium">Total Monthly Spend</p>
                            <h2 className="text-5xl font-bold mt-2 font-mono tracking-tight bg-gradient-to-br from-text-main via-white to-text-secondary text-transparent bg-clip-text drop-shadow-sm">
                                ₹{dashboardData.totalSpend.toLocaleString()}
                            </h2>
                        </div>
                    </div>
                </div>

                {/* Insight Card: Top Category */}
                <div className="glass-card flex flex-col justify-between">
                    <div className="flex items-center text-textSecondary mb-4">
                        <TrendingUp size={20} className="mr-2" />
                        <span className="font-medium">Top Category</span>
                    </div>
                    {dashboardData.categoryBreakdown.length > 0 ? (
                        <div>
                            <h3 className="text-2xl font-bold text-primary">
                                {dashboardData.categoryBreakdown.reduce((prev, current) => (prev.value > current.value) ? prev : current).name}
                            </h3>
                            <p className="text-textSecondary mt-1">Highest spend this month</p>
                        </div>
                    ) : (
                        <p className="text-textSecondary italic">No data yet</p>
                    )}
                </div>

                {/* Insight Card: Budget */}
                <div className="glass-card flex flex-col justify-between">
                    <div className="flex items-center text-textSecondary mb-4">
                        <Target size={20} className="mr-2" />
                        <span className="font-medium">Monthly Budget</span>
                    </div>
                    {user?.monthlyBudget ? (() => {
                        const remaining = user.monthlyBudget - dashboardData.totalSpend;
                        const percentUsed = (dashboardData.totalSpend / user.monthlyBudget) * 100;
                        let statusColor = 'text-success';
                        let barColor = 'bg-success';

                        // Using explicit classes, maybe tailwind doesn't have an orange by default?
                        // I will use text-warning for > 100% and text-yellow-500 for > 80% (which exists)
                        if (percentUsed > 100) {
                            statusColor = 'text-warning';
                            barColor = 'bg-warning';
                        } else if (percentUsed > 80) {
                            statusColor = 'text-yellow-500';
                            barColor = 'bg-yellow-500';
                        }

                        return (
                            <div>
                                <h3 className={`text-2xl font-bold ${statusColor}`}>
                                    {remaining >= 0 ? `₹${remaining.toLocaleString()} left` : `₹${Math.abs(remaining).toLocaleString()} over`}
                                </h3>
                                <div className="w-full bg-surface h-2 mt-3 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${barColor}`}
                                        style={{ width: `${Math.min(percentUsed, 100)}%` }}
                                    ></div>
                                </div>
                                <p className="text-textSecondary mt-2 text-sm">of ₹{user.monthlyBudget.toLocaleString()}</p>
                            </div>
                        );
                    })() : (
                        <div>
                            <p className="text-textSecondary italic mb-3">No budget set</p>
                            <button onClick={() => setIsBudgetModalOpen(true)} className="text-primary text-sm font-medium hover:underline">Set Budget Now</button>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Charts */}
                <div className="glass-card">
                    <h3 className="text-xl font-semibold mb-6">Spending by Category</h3>
                    <div className="h-64">
                        {dashboardData.categoryBreakdown.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={dashboardData.categoryBreakdown}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={70}
                                        outerRadius={90}
                                        paddingAngle={5}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {dashboardData.categoryBreakdown.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0F0F12', border: '1px solid rgba(222,225,229,0.1)', borderRadius: '8px' }}
                                        itemStyle={{ color: '#DEE1E5' }}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-full items-center justify-center text-textSecondary flex-col">
                                <PieChart size={48} className="mb-2 opacity-50" />
                                <p>No expenses logged.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Transactions Feed */}
                <div className="glass-card flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-semibold">Recent Activity</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                        {recentTransactions.length > 0 ? (
                            recentTransactions.map((tx) => (
                                <div key={tx._id} className="group flex justify-between items-center p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/5 hover:border-white/10 hover:shadow-lg transition-all duration-300">
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-4 group-hover:bg-primary group-hover:text-white group-hover:shadow-lg transition-all duration-300">
                                            <Tags size={20} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-text-main text-lg">{tx.description || tx.category}</p>
                                            <p className="text-sm text-text-secondary">{new Date(tx.date).toLocaleDateString()} • {tx.category}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-mono font-bold text-warning">-₹{tx.amount}</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex h-full items-center justify-center text-textSecondary">
                                <p>No recent activity</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <AddExpenseModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchData}
            />

            <SetBudgetModal
                isOpen={isBudgetModalOpen}
                onClose={() => setIsBudgetModalOpen(false)}
                onSuccess={fetchData}
            />
        </Layout>
    );
};

export default Dashboard;
