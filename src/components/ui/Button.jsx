const colors = {
    blue: {
        primary: "bg-blue-600 dark:bg-blue-400",
        secondary: "from-blue-800 to-blue-600 dark:from-blue-600 dark:to-blue-400",
    },
    green: {
        primary: "bg-green-500 dark:bg-green-400",
        secondary: "from-green-700 to-green-500 dark:from-green-600 dark:to-green-400",
    },
    red: {
        primary: "bg-red-600 dark:bg-red-400",
        secondary: "from-red-800 to-red-600 dark:from-red-600 dark:to-red-400",
    },
    yellow: {
        primary: "bg-yellow-500 dark:bg-yellow-400",
        secondary: "from-yellow-700 to-yellow-500 dark:from-yellow-600 dark:to-yellow-400",
    },
    gray: {
        primary: "bg-gray-600 dark:bg-gray-400",
        secondary: "from-gray-800 to-gray-600 dark:from-gray-600 dark:to-gray-400",
    },
}

export default function Button({type="button", color="blue", disabled, className="", onClick, children}) {
    const colorClasses = colors[color];
    return (
        <button type={type} className={`relative group ${colorClasses.primary} text-white dark:text-gray-900 text-sm font-medium border-none rounded-lg shadow-lg px-4 py-2 overflow-hidden focus:outline-none
            ${disabled ? 'form-not-allowed' : 'cursor-pointer active:scale-95 transition ease-linear'} ${className}`}
            onClick={onClick} disabled={disabled}
        >
            <span className={`absolute top-0 left-0 z-20 bg-gradient-to-br ${colorClasses.secondary} w-full h-full pointer-events-none translate-y-[90%]
                ${!disabled && 'group-hover:translate-y-0 transition ease-linear origin-bottom'}`} />
            <span className="relative flex justify-center items-center gap-2 w-full h-full z-30">
                {children}
            </span>
        </button>
    )
}
