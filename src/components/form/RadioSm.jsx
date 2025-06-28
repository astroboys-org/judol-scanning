const colors = {
    blue: "group-has-checked:bg-blue-600 dark:group-has-checked:bg-blue-400",
    green: "group-has-checked:bg-green-500 dark:group-has-checked:bg-green-400",
    red: "group-has-checked:bg-red-600 dark:group-has-checked:bg-red-400",
    yellow: "group-has-checked:bg-yellow-500 dark:group-has-checked:bg-yellow-400",
    gray: "group-has-checked:bg-gray-600 dark:group-has-checked:bg-gray-400",
}

export default function RadioSm({
    name, label, value,
    defaultChecked=false, inputRef, onChange,
    disabled=false, error=false,
    className="", color="blue", hint
}) {    
    return (
        <label className={`group flex flex-wrap items-center gap-2 text-sm font-medium rounded-full p-1.5 transition ${disabled ? "form-not-allowed" : "text-gray-700 dark:text-gray-400 cursor-pointer"}
            ${className}
        `}>
            <input type="radio" name={name} value={value} ref={inputRef} defaultChecked={defaultChecked} onChange={onChange} className="hidden" disabled={disabled} />

            <div className={`relative size-6 rounded-full bg-gray-300 dark:bg-gray-800 ${!disabled && 'group-hover:bg-gray-500 dark:group-hover:bg-gray-600'}
                ${colors[color]}`}>
                <span className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 size-3 rounded-full bg-white transition duration-200 ease-linear scale-150 group-has-checked:scale-100" />
            </div>
            {label && <span className="text-gray-600 dark:text-gray-500">{label}</span>}

            {hint && <p className={`w-full mt-1.5 text-xs ${error ? "text-red-500" : "text-gray-500" }`}>
                {hint}
            </p>}
        </label>
    )
}