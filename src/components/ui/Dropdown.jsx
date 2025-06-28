import { MenuItems } from "@headlessui/react";

export function Dropdown({ anchor="bottom start", className="", children }) {
    return (
        <MenuItems transition anchor={anchor}
            className={`flex flex-col gap-1 bg-white dark:bg-gray-700 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-md w-64 mt-5 p-3 z-40 focus:outline-none
            transition duration-100 ease-linear data-closed:scale-95 data-closed:opacity-0 ${className}`}
        >
            {children}
        </MenuItems>
    )
}
