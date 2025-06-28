import { useState } from "react"

export default function FileUpload({
    name, placeholder, inputRef, onChange,
    accept, disabled=false, error=false,
    className="", hint
}) {
    const [uploaded, setUploaded] = useState(false);
    const handleChange = (e) => {
        setUploaded(false);
        if (e.target.files.length !== 0) setUploaded(true);
        if (onChange) onChange(e);
    }
    
    return (
        <div className="group relative rounded-lg overflow-hidden w-full">
            <input type="file" name={name} placeholder={placeholder} ref={inputRef} onChange={handleChange} disabled={disabled} accept={accept}
                className={`form-input cursor-pointer ${!disabled ? 'form-input-hover' : 'form-not-allowed before:form-not-allowed'} ${error && 'border-red-400'}
                    ${!uploaded ? 'text-gray-400 dark:text-white/30' : 'dark:text-white/90'}
                    file:w-12 file:text-transparent
                    before:absolute before:top-0 before:left-0 before:z-20 before:content-(--file-upload-icon) before:bg-gray-200 dark:before:bg-gray-800 before:text-gray-500 dark:before:text-white/50 before:border dark:before:border-none before:rounded-l-lg before:cursor-pointer before:w-12 before:h-10 before:px-3 before:py-2.5
                    ${className}
                `}
            />

            <div className={`form-input-bar ${error && 'bg-red-600 dark:bg-red-400'}`}/>

            {hint && (
                <p className={`form-input-hint ${error && "text-red-500"}`}>{hint}</p>
            )}
        </div>
    )
}
