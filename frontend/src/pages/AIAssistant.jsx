import { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout';
import ReactMarkdown from 'react-markdown';
import { Sparkles, Loader2, Bot } from 'lucide-react';

const AIAssistant = () => {
    const [insight, setInsight] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchInsights = async () => {
            try {
                const res = await axios.get('/api/ai/insights');
                setInsight(res.data.insight);
            } catch (err) {
                console.error(err);
                setError('Failed to load AI insights. Make sure your Gemini API key is configured correctly.');
            } finally {
                setLoading(false);
            }
        };

        fetchInsights();
    }, []);

    return (
        <Layout>
            <div className="mb-8 flex items-center">
                <div className="p-3 rounded-xl bg-indigo-500/20 text-indigo-400 mr-4 shadow-lg shadow-indigo-500/10">
                    <Sparkles size={28} />
                </div>
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 text-transparent bg-clip-text">AI Financial Advisor</h1>
                    <p className="text-text-secondary mt-1">Powered by Google Gemini</p>
                </div>
            </div>

            <div className="glass-card relative overflow-hidden min-h-[400px]">
                {/* Glowing backdrop effect */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10 p-4 md:p-8">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center h-64 text-text-secondary">
                            <Loader2 className="w-12 h-12 text-indigo-400 animate-spin mb-4" />
                            <p className="animate-pulse">Analyzing your recent transactions and budget...</p>
                        </div>
                    ) : error ? (
                        <div className="bg-warning/10 border border-warning text-warning p-6 rounded-xl flex items-start">
                            <Bot className="w-6 h-6 mr-4 mt-0.5 flex-shrink-0" />
                            <div>
                                <h3 className="font-bold mb-1">Analysis Failed</h3>
                                <p>{error}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="prose prose-invert max-w-none text-text-main prose-headings:text-indigo-300 prose-a:text-indigo-400 prose-strong:text-text-main text-lg leading-relaxed">
                            <ReactMarkdown>
                                {insight}
                            </ReactMarkdown>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default AIAssistant;
