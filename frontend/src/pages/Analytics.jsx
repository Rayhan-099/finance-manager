import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';
import { ThemeContext } from '../context/ThemeContext';
import { AuthContext } from '../context/AuthContext';
import { AlertCircle } from 'lucide-react';

const Analytics = () => {
    const { isDark } = useContext(ThemeContext);
    const { user } = useContext(AuthContext);
    const [analyticsData, setAnalyticsData] = useState({ categoryBreakdown: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const res = await axios.get('/api/analytics/dashboard');
                setAnalyticsData(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) {
        return <Layout><div className="flex h-full items-center justify-center">Loading Analytics...</div></Layout>;
    }

    return (
        <Layout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Analytics</h1>
                <p className="text-text-secondary mt-1">Deep dive into your spending habits</p>
            </div>

            <div className="glass-card mb-8">
                <h3 className="text-xl font-semibold mb-6">Spend by Category (Bar Chart)</h3>
                <div className="h-80 w-full">
                    {analyticsData.categoryBreakdown.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={analyticsData.categoryBreakdown} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "rgba(222,225,229,0.1)" : "rgba(17,24,39,0.1)"} />
                                <XAxis dataKey="name" stroke={isDark ? "#9B9AA2" : "#6B7280"} />
                                <YAxis stroke={isDark ? "#9B9AA2" : "#6B7280"} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: isDark ? '#0F0F12' : '#FFFFFF',
                                        border: `1px solid ${isDark ? 'rgba(222,225,229,0.1)' : 'rgba(17,24,39,0.1)'}`,
                                        borderRadius: '8px'
                                    }}
                                    itemStyle={{ color: isDark ? '#DEE1E5' : '#111827' }}
                                    cursor={{ fill: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
                                />
                                <Legend />
                                <Bar dataKey="value" name="Amount (₹)" fill="#3A41B2" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex h-full items-center justify-center text-text-secondary">
                            <p>Not enough data for analytics.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Category Budgets (Envelope System) */}
            <div className="glass-card mb-8">
                <h3 className="text-xl font-semibold mb-6">Category Budgets (Envelope System)</h3>

                {(!user?.categoryBudgets || user.categoryBudgets.filter(b => b.limit > 0).length === 0) ? (
                    <div className="flex flex-col items-center justify-center py-8 text-text-secondary">
                        <p>You haven't set any specific category budgets.</p>
                        <p className="text-sm mt-1">Visit your Profile to configure spending limits.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {user.categoryBudgets.filter(b => b.limit > 0).map((budget, idx) => {
                            const spentObj = analyticsData.categoryBreakdown.find(s => s.name === budget.category);
                            const spent = spentObj ? spentObj.value : 0;
                            const progress = Math.min((spent / budget.limit) * 100, 100);
                            const isOverBudget = spent > budget.limit;
                            const isNearBudget = spent > budget.limit * 0.8 && !isOverBudget;

                            let progressColor = 'bg-primary';
                            if (isOverBudget) progressColor = 'bg-danger';
                            else if (isNearBudget) progressColor = 'bg-warning';

                            return (
                                <div key={idx} className="space-y-2">
                                    <div className="flex justify-between items-end">
                                        <div className="flex items-center">
                                            <span className="font-medium text-text-main">{budget.category}</span>
                                            {isOverBudget && <AlertCircle size={16} className="text-danger ml-2" />}
                                        </div>
                                        <div className="text-sm">
                                            <span className={`font-medium ${isOverBudget ? 'text-danger' : 'text-text-main'}`}>₹{spent.toLocaleString()}</span>
                                            <span className="text-text-secondary"> / ₹{budget.limit.toLocaleString()}</span>
                                        </div>
                                    </div>
                                    <div className="w-full bg-black/10 dark:bg-white/10 rounded-full h-3 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    {(isOverBudget || isNearBudget) && (
                                        <p className={`text-xs ${isOverBudget ? 'text-danger' : 'text-warning'}`}>
                                            {isOverBudget ? `You are ₹${(spent - budget.limit).toLocaleString()} over budget!` : 'Nearing your budget limit!'}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Analytics;
