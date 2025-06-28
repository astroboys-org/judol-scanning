export default function InputText({
    type="text", name, placeholder, value,
    inputRef, onChange, onKeyDown,
    min, max, step,
    disabled=false, error=false,
    className="", hint
}) {
    return (
        <div className="group relative rounded-lg overflow-hidden w-full">
            <input type={type} name={name} placeholder={placeholder} value={value} ref={inputRef} onChange={onChange} onKeyDown={onKeyDown}
                min={min} max={max} step={step} disabled={disabled}
                className={`form-input ${!disabled ? 'form-input-hover' : 'form-not-allowed'} ${error && 'border-red-400'} ${className}`}
            />

            <div className={`form-input-bar ${error && 'bg-red-600 dark:bg-red-400'}`}/>

            {hint && (
                <p className={`form-input-hint ${error && "text-red-500"}`}>{hint}</p>
            )}
        </div>
    )
}
