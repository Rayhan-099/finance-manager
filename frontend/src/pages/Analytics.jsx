import { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';

const Analytics = () => {
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
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(222,225,229,0.1)" />
                                <XAxis dataKey="name" stroke="#9B9AA2" />
                                <YAxis stroke="#9B9AA2" />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#0F0F12', border: '1px solid rgba(222,225,229,0.1)', borderRadius: '8px' }}
                                    itemStyle={{ color: '#DEE1E5' }}
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
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
        </Layout>
    );
};

export default Analytics;
