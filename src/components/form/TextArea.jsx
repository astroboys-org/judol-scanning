export default function TextArea({
    name, placeholder, value, inputRef, onChange,
    rows=3, disabled=false, error=false,
    className="", hint
}) {
    return (
        <div className="group relative rounded-lg overflow-hidden w-full h-min">
            <textarea name={name} placeholder={placeholder} value={value} ref={inputRef} onChange={onChange} rows={rows} disabled={disabled}
                className={`form-input h-auto ${!disabled ? 'form-input-hover' : 'form-not-allowed'} ${error && 'border-red-400'} ${className}`}
            ></textarea>

            <div className={`form-input-bar ${error && 'bg-red-600 dark:bg-red-400'}`}/>

            {hint && (
                <p className={`form-input-hint ${error && "text-red-500"}`}>{hint}</p>
            )}
        </div>
    )
}
