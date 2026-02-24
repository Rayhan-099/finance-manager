import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Receipt, PieChart, LogOut } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Sidebar = () => {
    const location = useLocation();
    const { logout } = useContext(AuthContext);

    const navItems = [
        { path: '/', label: 'Overview', icon: <LayoutDashboard size={20} /> },
        { path: '/transactions', label: 'Transactions', icon: <Receipt size={20} /> },
        { path: '/analytics', label: 'Analytics', icon: <PieChart size={20} /> },
    ];

    return (
        <div className="w-full md:w-64 bg-surface border-t md:border-t-0 md:border-r border-white/10 h-16 md:h-screen fixed bottom-0 md:relative z-10 flex md:flex-col justify-around md:justify-start pt-0 md:pt-8 px-4 md:px-0">

            {/* Logo Area - Hidden on mobile */}
            <div className="hidden md:flex items-center px-8 mb-8">
                <div className="w-10 h-10 rounded-xl primary-gradient flex items-center justify-center mr-3 shadow-lg shadow-primary/30">
                    <span className="text-white font-black text-xl tracking-tighter">M</span>
                </div>
                <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-text-main to-text-secondary text-transparent bg-clip-text">Moneta</h1>
            </div>

            {/* Navigation */}
            <nav className="flex md:flex-col w-full px-2 md:px-4 gap-1 md:gap-2 justify-around md:justify-start items-center md:items-stretch h-full md:h-auto">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center relative justify-center md:justify-start px-3 md:px-4 py-2 md:py-3 rounded-xl transition-all duration-300 ${isActive
                                ? 'bg-primary/10 text-primary font-semibold shadow-lg'
                                : 'text-text-secondary hover:text-text-main hover:bg-white/5'
                                }`}
                        >
                            {isActive && (
                                <div className="absolute inset-0 bg-primary/5 rounded-xl blur-md" />
                            )}
                            <div className="relative z-10 flex items-center">
                                {item.icon}
                                <span className="hidden md:block ml-3">{item.label}</span>
                            </div>
                            {isActive && (
                                <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-primary rounded-r-full shadow-lg" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="hidden md:block mt-auto p-4 mb-4">
                <button
                    onClick={logout}
                    className="flex items-center w-full px-4 py-3 text-textSecondary hover:text-warning transition-colors rounded-lg hover:bg-warning/10"
                >
                    <LogOut size={20} />
                    <span className="ml-3 font-medium">Log out</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
