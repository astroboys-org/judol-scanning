import { MenuItem } from "@headlessui/react";

export function DropdownItem({ as="button", href, onClick, className="", children }) {
    const handleClick = event => {
        if (tag === "button") {
            event.preventDefault();
        }

        if (onClick) onClick();
    }

    return (
        <MenuItem as={as} href={href} onClick={handleClick}
            className={`flex items-center gap-3 font-medium text-gray-500 rounded-lg group text-sm hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 ${className}`}
        >
            {children}
        </MenuItem>
    )
}
