import { useState } from "react"
import { Dropdown } from "../ui/Dropdown"
import { Link } from "react-router"
import { Menu, MenuButton } from "@headlessui/react"
import { BellIcon } from "@heroicons/react/24/outline"

export default function NotificationDropdown() {
	const [notifying, setNotifying] = useState(true);

	return (
		<Menu>
            <MenuButton className="relative flex items-center justify-center text-gray-500 transition-colors bg-white border border-gray-200 rounded-full hover:text-gray-700 h-11 w-11 hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                onClick={() => setNotifying(false)}>
                <span className={`absolute right-0 top-0.5 z-10 h-2 w-2 rounded-full bg-orange-400 ${!notifying ? "hidden" : "flex"}`}>
                    <span className="absolute inline-flex w-full h-full bg-orange-400 rounded-full opacity-75 animate-ping"></span>
                </span>
                <BellIcon className="size-6" />
            </MenuButton>

			<Dropdown anchor="bottom end" className="origin-top-right">
				<div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100 dark:border-gray-700">
					<h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
						Notification
					</h5>
				</div>
				<ul className="flex flex-col min-h-32 max-h-64 overflow-y-auto custom-scrollbar">
					<li className="block gap-1.5 rounded-lg border-b border-gray-100 dark:border-gray-800 p-1 hover:bg-gray-100 dark:hover:bg-white/5">
                        <p className="text-sm font-medium text-gray-800 dark:text-white/90 mb-0">
                            Notif 1
                        </p>
                        <span className="text-sm text-gray-500 dark:text-gray-400">message here 1</span>
                        <span className="flex items-center gap-2 text-gray-500 text-xs dark:text-gray-400">
                            <span>Type 1</span>
                            <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                            <span>Time 1</span>
                        </span>
					</li>
				</ul>

				<Link to="/notifications" className="block px-4 py-2 mt-3 text-sm font-medium text-center text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700">
					View All Notifications
				</Link>
			</Dropdown>
		</Menu>
	)
}
