const colors = {
    blue: "bg-blue-200 dark:bg-blue-600/80 text-blue-600 dark:text-blue-100",
    red: "bg-red-200 dark:bg-red-600/80 text-red-600 dark:text-red-100",
    green: "bg-green-200 dark:bg-green-600/80 text-green-600 dark:text-green-50",
    yellow: "bg-yellow-200 dark:bg-yellow-500/80 text-yellow-600 dark:text-yellow-100",
    gray: "bg-gray-300 dark:bg-gray-600/80 text-gray-700 dark:text-gray-100",
    white: "bg-white dark:bg-gray-900 text-gray-700 dark:text-white",
}

export default function Badge({color="blue", className="", children }) {
    const colorClasses = colors[color];
    return (
        <span className={`inline-flex justify-center items-center gap-1 ${colorClasses} text-xs font-medium tracking-wide rounded-full px-2.5 py-0.5 cursor-default ${className}`}>
            {children}
        </span>
    )
}
