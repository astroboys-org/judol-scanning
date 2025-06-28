import { useTheme } from "../../context/ThemeContext";
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'

export function ThemeToggleButton() {
	const { toggleTheme } = useTheme();

	return (
		<button
			onClick={toggleTheme}
			className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-dark-900 h-11 w-11 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
		>
            <SunIcon className="size-6 dark:hidden" />
            <MoonIcon className="size-6 hidden dark:block" />
		</button>
	);
};
