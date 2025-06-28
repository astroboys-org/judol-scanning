import { Menu, MenuButton, MenuItems } from "@headlessui/react"
import { ChevronDownIcon, XMarkIcon } from "@heroicons/react/24/outline"
import { useState } from "react"

export default function MultiSelect({
    placeholder="Select...", inputRef, onChange,
    disabled=false, error=false,
    className="", hint,
    options, defaultSelected=[],
}) {
    const [selectedOptions, setSelectedOptions] = useState(defaultSelected);

    const handleSelect = optionKey => {
        const newSelectedOptions = selectedOptions.includes(optionKey)
            ? selectedOptions.filter(key => key !== optionKey)
            : [...selectedOptions, optionKey];

        setSelectedOptions(newSelectedOptions);
        onChange?.(newSelectedOptions);
    }

    const removeOption = optionKey => {
        const newSelectedOptions = selectedOptions.filter(key => key !== optionKey);
        setSelectedOptions(newSelectedOptions);
        onChange?.(newSelectedOptions);
    }

    return (
        <div className="relative w-full">
            <Menu>
                <MenuButton disabled={disabled} className={`form-input relative group flex items-center overflow-hidden ${!disabled ? 'form-input-hover' : 'form-not-allowed'} ${error && 'border-red-400'} ${className}`}>
                    <div className="flex flex-wrap flex-auto gap-2">
                        {selectedOptions.length > 0 ? (
                            selectedOptions.map(optionKey => (
                                <div key={optionKey} className="group flex flex-wrap justify-center items-center gap-2 text-sm font-medium cursor-pointer select-none rounded-full py-1 pl-2.5 pr-2 transition
                                    bg-blue-600 dark:bg-blue-400">
                                    <span className="flex-initial text-white dark:text-gray-900 text-xs max-w-full text-ellipsis">{options[optionKey]}</span>
                                    <div className="flex flex-row-reverse flex-auto">
                                        <div className={`pl-2 text-gray-200 dark:text-gray-700 cursor-pointer hover:scale-110 transition ${disabled && 'form-not-allowed'}`}
                                            onClick={e => {
                                                e.stopPropagation();
                                                removeOption(optionKey);
                                            }}>
                                            <XMarkIcon className="size-3.5 stroke-3" />
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <span className="bg-transparent text-sm text-left border-0 outline-hidden appearance-none text-gray-400 dark:text-white/30 size-full focus:border-0 focus:outline-hidden focus:ring-0">
                                {placeholder}
                            </span>
                        )}
                    </div>

                    <span className="absolute top-1/2 right-4 -translate-y-1/2 appearance-none text-gray-700 dark:text-white/80 transition group-data-open:rotate-180">
                        <ChevronDownIcon className="size-4" />
                    </span>

                    <div className={`form-input-bar group-data-focus:scale-100 group-data-open:scale-100 ${error && 'bg-red-600 dark:bg-red-400'}`}/>
                </MenuButton>

                <MenuItems modal={false} transition className="absolute top-full left-0 flex flex-col gap-1 bg-white rounded-lg border border-gray-200 shadow-xs w-(--button-width) min-h-32 max-h-64 mt-1 p-3 z-40 dark:border-gray-800 dark:bg-gray-700 focus:outline-none
                    transition duration-100 ease-linear origin-top data-closed:scale-95 data-closed:opacity-0">
                    {Object.keys(options).map((key) => (
                        <div key={key} onClick={() => handleSelect(key)} className={`w-full cursor-pointer rounded-t border-b border-gray-200 dark:border-gray-800 text-white text-sm
                            ${selectedOptions.includes(key) 
                                ? "bg-blue-400 dark:bg-blue-600 hover:bg-blue-300 dark:hover:bg-blue-400"
                                : "bg-transparent hover:bg-gray-200 dark:hover:bg-gray-800"
                        }`}>
                            <div className={`relative flex w-full items-center p-1 pl-2`}>
                                <div className="mx-2 leading-6 text-gray-800 dark:text-white/90">
                                    {options[key]}
                                </div>
                            </div>
                        </div>
                    ))}
                </MenuItems>
            </Menu>

            {hint && (
                <p className={`form-input-hint ${error && "text-red-500"}`}>{hint}</p>
            )}
        </div>
    )
}
