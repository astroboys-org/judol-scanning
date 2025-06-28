export default function Card({title, subtitle, rightIcon, className="", children}) {
    return (
        <div className={`bg-white dark:bg-white/10 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm dark:shadow-xl p-5 md:p-6 ${className}`}>
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">{title}</h3>
                    {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-0">{subtitle}</p>}
                </div>
                <div className="relative inline-block">
                    {rightIcon}
                </div>
            </div>
            <div className={`relative ${(title || subtitle || rightIcon) && 'mt-2'}`}>
                {children}
            </div>
        </div>
    )
}
