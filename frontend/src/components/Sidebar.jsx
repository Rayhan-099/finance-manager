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
        <div className="w-full md:w-64 bg-surface border-t md:border-t-0 md:border-r border-[rgba(222,225,229,0.1)] h-16 md:h-screen fixed bottom-0 md:relative z-10 flex md:flex-col justify-around md:justify-start pt-0 md:pt-8 px-4 md:px-0">

            {/* Logo Area - Hidden on mobile */}
            <div className="hidden md:flex items-center px-8 mb-8">
                <div className="w-8 h-8 rounded-lg primary-gradient flex items-center justify-center mr-3">
                    <span className="text-white font-bold text-lg">M</span>
                </div>
                <h1 className="text-xl font-bold tracking-tight">Moneta</h1>
            </div>

            {/* Navigation */}
            <nav className="flex md:flex-col w-full px-2 md:px-4 gap-1 md:gap-2 justify-around md:justify-start items-center md:items-stretch h-full md:h-auto">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center justify-center md:justify-start px-3 md:px-4 py-2 md:py-3 rounded-lg transition-all duration-300 ${isActive
                                    ? 'bg-primary/10 text-primary font-medium'
                                    : 'text-textSecondary hover:text-textMain hover:bg-[rgba(255,255,255,0.02)]'
                                }`}
                        >
                            {item.icon}
                            <span className="hidden md:block ml-3">{item.label}</span>
                            {isActive && (
                                <div className="hidden md:block absolute left-0 w-1 h-8 bg-primary rounded-r-full" />
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
