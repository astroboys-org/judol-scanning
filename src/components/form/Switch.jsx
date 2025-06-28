import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline'

export default function Switch({
    name, label, value,
    defaultChecked=false, inputRef, onChange,
    disabled=false, error=false,
    className="", hint
}) {    
    return (
        <label className={`group flex flex-wrap items-center gap-2 text-sm font-medium ${disabled ? "form-not-allowed" : "text-gray-700 dark:text-gray-400 cursor-pointer"} ${className}`}>
            <input type="checkbox" name={name} ref={inputRef} value={value} defaultChecked={defaultChecked} className="hidden" onChange={onChange} disabled={disabled} />
            {label && <span className="text-gray-700 dark:text-gray-400">{label}</span>}

            <div className={`relative inline-flex h-[26px] w-12 items-center rounded-full bg-gray-200 dark:bg-gray-800 group-has-checked:bg-blue-600 dark:group-has-checked:bg-blue-400
                ${!disabled && 'group-hover:bg-gray-300 dark:group-hover:bg-gray-700 group-has-checked:group-hover:bg-blue-500 dark:group-has-checked:group-hover:bg-blue-300'}`}>
                <span className="size-5 translate-x-1 rounded-full bg-white grid place-items-center transition duration-200 ease-linear group-has-checked:translate-x-6">
                    <XMarkIcon className="size-3 stroke-3 text-gray-400 dark:text-gray-700 group-has-checked:hidden" />
                    <CheckIcon className="size-3 stroke-3 text-blue-600 hidden group-has-checked:inline-block" />
                </span>
            </div>

            {hint && <p className={`w-full mt-1.5 text-xs ${error ? "text-red-500" : "text-gray-500" }`}>
                {hint}
            </p>}
        </label>
    )
}