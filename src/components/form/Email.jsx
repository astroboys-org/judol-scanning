import { EnvelopeIcon } from "@heroicons/react/24/outline";

export default function Email({
    name, placeholder, value, inputRef, onChange,
    disabled=false, error=false,
    className="", hint
}) {
    return (
        <div className="group relative rounded-lg overflow-hidden w-full">
            <input type="email" name={name} placeholder={placeholder} value={value} ref={inputRef} onChange={onChange} disabled={disabled}
                className={`form-input pl-14 pr-4 ${!disabled ? 'form-input-hover' : 'form-not-allowed'} ${error && 'border-red-400'} ${className}`}
            />

            <div className={`absolute top-0 left-0 z-20 inline-flex justify-center text-center bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-white/50 border dark:border-gray-900 rounded-l-lg cursor-pointer w-12 h-full px-2 py-2.5
                ${disabled && 'form-not-allowed'}`}>
                <EnvelopeIcon className="size-5" />
            </div>

            <div className={`form-input-bar ${error && 'bg-red-600 dark:bg-red-400'}`}/>

            {hint && (
                <p className={`form-input-hint ${error && "text-red-500"}`}>{hint}</p>
            )}
        </div>
    )
}
