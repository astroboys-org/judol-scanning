import { CalendarDaysIcon } from "@heroicons/react/24/outline";
import { useState } from "react"
import ReactDatePicker from "react-datepicker";

export default function DatePicker({
    name, placeholder, value, inputRef, onChange,
    min, max, showTimeSelect, showYearDropdown,
    disabled=false, error=false,
    className="", hint
}) {
    const [selectedDate, setSelectedDate] = useState(inputRef?.current?.value ?? null);
    const handleChange = (date) => {
        setSelectedDate(date);
        onChange?.(date);
    }

    return (
        <div className="group relative rounded-lg w-full">
            <ReactDatePicker name={name} placeholderText={placeholder} value={value} ref={inputRef} selected={selectedDate} onChange={(date) => handleChange(date)} disabled={disabled}
                dateFormat="dd/MM/yyy" minDate={min} maxDate={max} isClearable showTimeSelect={showTimeSelect} showYearDropdown={showYearDropdown}
                className={`form-input pl-14 pr-4 ${!disabled ? 'form-input-hover' : 'form-not-allowed'} ${error && 'border-red-400'} ${className}`}
            />

            <div className={`absolute top-0 left-0 z-20 inline-flex justify-center text-center bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-white/50 border dark:border-gray-900 rounded-l-lg cursor-pointer w-12 h-full px-2 py-2.5
                ${disabled && 'form-not-allowed'}`}>
                <CalendarDaysIcon className="size-5" />
            </div>

            <div className={`form-input-bar ${error && 'bg-red-600 dark:bg-red-400'}`}/>

            {hint && (
                <p className={`form-input-hint ${error && "text-red-500"}`}>{hint}</p>
            )}
        </div>
    )
}
