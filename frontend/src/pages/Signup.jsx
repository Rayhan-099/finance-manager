import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Wallet } from 'lucide-react';

const Signup = () => {
    const { signup } = useContext(AuthContext);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signup(formData.name, formData.email, formData.password);
        } catch (err) {
            setError(err.response?.data?.msg || 'An error occurred during signup');
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center p-4 relative overflow-hidden">
            {/* Ambient Background Elements */}
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#1A1999]/30 rounded-full blur-[100px] -z-10 mix-blend-screen animate-pulse" style={{ animationDuration: '4s' }} />
            <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#FF4C61]/10 rounded-full blur-[100px] -z-10 mix-blend-screen animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />

            <div className="w-full max-w-md glass-card flex flex-col items-center relative z-10 border-white/10 shadow-2xl">
                <div className="bg-surface p-4 rounded-xl border border-white/10 mb-6 shadow-lg -rotate-3">
                    <Wallet size={36} className="text-primary rotate-3" />
                </div>
                <h2 className="text-3xl font-bold mb-2 text-text-main bg-gradient-to-l from-white to-text-secondary text-transparent bg-clip-text">Create Account</h2>
                <p className="text-text-secondary mb-8 text-center">Start tracking your financial health</p>

                {error && <div className="w-full bg-warning/20 border border-warning text-warning px-4 py-2 rounded-lg mb-4">{error}</div>}

                <form onSubmit={handleSubmit} className="w-full space-y-5">
                    <div>
                        <label className="block text-sm font-medium mb-1.5 text-text-secondary">Full Name</label>
                        <input
                            type="text"
                            required
                            className="input-field"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="John Doe"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1.5 text-text-secondary">Email</label>
                        <input
                            type="email"
                            required
                            className="input-field"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="you@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1.5 text-text-secondary">Password</label>
                        <input
                            type="password"
                            required
                            className="input-field"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            placeholder="Minimum 6 characters"
                            minLength={6}
                        />
                    </div>
                    <button type="submit" className="btn-primary w-full mt-8 py-3.5 text-lg font-bold tracking-wide">
                        Create Account
                    </button>
                </form>

                <p className="mt-8 text-sm text-text-secondary">
                    Already have an account? <Link to="/login" className="text-primary font-medium hover:text-white transition-colors">Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
