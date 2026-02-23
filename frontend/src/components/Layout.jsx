import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-background text-textMain">
            <Sidebar />
            <main className="flex-1 p-4 md:p-8 pb-20 md:pb-8 overflow-y-auto">
                <div className="max-w-6xl mx-auto h-full">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
