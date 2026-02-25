export const CurrentCapitalLogo = ({ className = "" }) => (
    <svg
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        fill="currentColor"
    >
        <defs>
            <linearGradient id="primaryGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#4F46E5" />
                <stop offset="100%" stopColor="#3730A3" />
            </linearGradient>
        </defs>
        <path
            d="M50 10 
         C 75 10, 90 25, 90 50 
         C 90 75, 75 90, 50 90
         C 25 90, 10 75, 10 50
         C 10 25, 25 10, 50 10 Z"
            fill="none"
            stroke="url(#primaryGrad)"
            strokeWidth="8"
            strokeLinecap="round"
        />
        <path
            d="M30 40 
         C 40 25, 60 25, 70 40"
            fill="none"
            stroke="#10B981"
            strokeWidth="8"
            strokeLinecap="round"
        />
        <path
            d="M30 60 
         C 40 75, 60 75, 70 60"
            fill="none"
            stroke="#10B981"
            strokeWidth="8"
            strokeLinecap="round"
        />
    </svg>
);
