import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useState } from "react"

export default function Password({
    name, placeholder, value, inputRef, onChange,
    disabled=false, error=false,
    className="", hint
}) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="group relative rounded-lg overflow-hidden w-full">
            <input type={showPassword ? 'text' : 'password'} name={name}
                placeholder={placeholder} value={value} ref={inputRef} onChange={onChange} disabled={disabled}
                className={`form-input ${!disabled ? 'form-input-hover' : 'form-not-allowed'} ${error && 'border-red-400'} ${className}`}
            />

            <span onClick={() => setShowPassword(prev => !prev)}
                className={`absolute top-1/2 right-4 -translate-y-1/2 appearance-none ${!disabled ? 'cursor-pointer' : 'form-not-allowed'}
                ${showPassword ? 'text-gray-700 dark:text-white/80' : 'text-gray-400 dark:text-white/30'}`}>
                {showPassword
                    ? <EyeIcon className="size-4" />
                    : <EyeSlashIcon className="size-4" />
                }
            </span>

            <div className={`form-input-bar ${error && 'bg-red-600 dark:bg-red-400'}`}/>

            {hint && (
                <p className={`form-input-hint ${error && "text-red-500"}`}>{hint}</p>
            )}
        </div>
    )
}
