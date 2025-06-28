export default function Radio({
    name, label, value,
    defaultChecked=false, inputRef, onChange,
    disabled=false, error=false,
    className="", hint
}) {    
    return (
        <label className={`group flex flex-wrap justify-center items-center gap-2 text-sm font-medium select-none rounded-full p-1.5 transition ${disabled ? "form-not-allowed" : "hover:bg-gray-200 dark:hover:bg-gray-700"}
            has-checked:bg-blue-600 dark:has-checked:bg-blue-400
            ${className}
        `}>
            <input type="radio" name={name} value={value} ref={inputRef} defaultChecked={defaultChecked} onChange={onChange} className="hidden" disabled={disabled} />

            <div className="relative size-6 rounded-full bg-gray-300 dark:bg-gray-800 group-has-checked:bg-blue-400 dark:group-has-checked:bg-blue-600">
                <span className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 size-3 rounded-full bg-white transition duration-200 ease-linear scale-150 group-has-checked:scale-100" />
            </div>
            {label && <span className="text-gray-600 dark:text-gray-500 group-has-checked:text-white dark:group-has-checked:text-gray-900 mr-2">{label}</span>}

            {hint && <p className={`w-full mt-1.5 text-xs ${error ? "text-red-500" : "text-gray-500" }`}>
                {hint}
            </p>}
        </label>
    )
}