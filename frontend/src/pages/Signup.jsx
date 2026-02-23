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
        <div className="min-h-screen flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-md glass-card flex flex-col items-center">
                <div className="bg-surface p-4 rounded-full border border-[rgba(222,225,229,0.1)] mb-6 shadow-lg">
                    <Wallet size={36} className="text-primary" />
                </div>
                <h2 className="text-2xl font-semibold mb-2 text-textMain">Create Account</h2>
                <p className="text-textSecondary mb-8">Start tracking your financial health</p>

                {error && <div className="w-full bg-warning/20 border border-warning text-warning px-4 py-2 rounded-lg mb-4">{error}</div>}

                <form onSubmit={handleSubmit} className="w-full space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-textSecondary">Full Name</label>
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
                        <label className="block text-sm font-medium mb-1 text-textSecondary">Email</label>
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
                        <label className="block text-sm font-medium mb-1 text-textSecondary">Password</label>
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
                    <button type="submit" className="btn-primary w-full mt-6 py-3">
                        Create Account
                    </button>
                </form>

                <p className="mt-6 text-sm text-textSecondary">
                    Already have an account? <Link to="/login" className="text-primary hover:underline transition-all">Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
