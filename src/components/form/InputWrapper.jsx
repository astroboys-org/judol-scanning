export default function InputWrapper({ label, htmlFor, className="", children }) {
    return (
        <div className={`flex flex-col justify-start items-start w-full ${className}`}>
            <label htmlFor={htmlFor}
                className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-400 $className">
                {label}
            </label>
            {children}
        </div>
    )
}
