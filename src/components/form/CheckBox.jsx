import { CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function CheckBox({
    name, label, value,
    defaultChecked=false, inputRef, onChange,
    disabled=false, error=false,
    className="", hint
}) {    
    return (
        <label className={`group flex flex-wrap items-center gap-2 text-sm font-medium rounded-lg p-1.5 transition ${disabled ? "form-not-allowed" : "text-gray-700 dark:text-gray-400 cursor-pointer"}
            ${className}
        `}>
            <input type="checkbox" name={name} value={value} ref={inputRef} defaultChecked={defaultChecked} onChange={onChange} className="hidden" disabled={disabled} />

            {label && <span className="text-gray-600 dark:text-gray-500">{label}</span>}
            <div className={`relative grid place-items-center bg-transparent size-6 rounded-lg border-[3px] border-gray-300 dark:border-gray-800
                ${!disabled && 'group-hover:border-gray-500 dark:group-hover:border-gray-600'}
                group-has-checked:bg-blue-600 dark:group-has-checked:bg-blue-400 group-has-checked:border-blue-600 dark:group-has-checked:border-blue-400
                transition duration-200 ease-linear`}>
                <XMarkIcon className={`size-4 stroke-3 text-gray-300 dark:text-gray-800 ${!disabled && 'group-hover:text-gray-500 dark:group-hover:text-gray-600'}
                    group-has-checked:hidden transition duration-200 ease-linear origin-center`} />
                <CheckIcon className="size-4 stroke-3 text-white hidden group-has-checked:block transition duration-200 ease-linear origin-center" />
            </div>

            {hint && <p className={`w-full mt-1.5 text-xs ${error ? "text-red-500" : "text-gray-500" }`}>
                {hint}
            </p>}
        </label>
    )
}