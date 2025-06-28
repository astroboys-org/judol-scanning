import { ChevronDownIcon } from "@heroicons/react/24/outline";

export default function Select({
    name, placeholder="Select...", value, inputRef, onChange,
    disabled=false, error=false,
    className="", hint,
    options
}) {
    return (
        <div className="group relative rounded-lg overflow-hidden w-full">
            <select name={name} ref={inputRef} value={value} onChange={onChange} disabled={disabled}
                className={`form-input ${!disabled ? 'form-input-hover' : 'form-not-allowed'} ${error && 'border-red-400'} ${className}
                ${!value && 'text-gray-400 dark:text-white/30'}
            `}>
                <option value="" className="text-gray-500 dark:bg-gray-900 dark:text-gray-400" hidden>{placeholder}</option>

                {Object.keys(options).map((key) => (
                    <option key={key} value={key} className="text-gray-700 dark:bg-gray-900 dark:text-gray-400">
                        {options[key]}
                    </option>
                ))}
            </select>

            <span className={`absolute top-1/2 right-4 -translate-y-1/2 appearance-none group-has-open:rotate-180 text-gray-700 dark:text-white/80 transition
                ${disabled && 'form-not-allowed'}`}>
                <ChevronDownIcon className="size-4" />
            </span>

            <div className={`form-input-bar ${error && 'bg-red-600 dark:bg-red-400'}`}/>

            {hint && (
                <p className={`form-input-hint ${error && "text-red-500"}`}>{hint}</p>
            )}
        </div>
    )
}
