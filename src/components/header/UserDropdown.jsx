import { useState } from "react";
import { Menu, MenuButton } from "@headlessui/react";
import { Dropdown } from '../ui/Dropdown'
import { DropdownItem } from '../ui/DropdownItem'
import { ArrowLeftStartOnRectangleIcon, ChevronDownIcon, Cog6ToothIcon, InformationCircleIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router";
import req, { errorReqHandler } from "../../req/req";

export default function UserDropdown() {
	const [isOpen, setIsOpen] = useState(false);
    const { auth, setAuth } = useAuth();

    const navigate = useNavigate();

    const handleLogOut = async (e) => {
        e.preventDefault();

        try {
            const res = await req.post('/logout', {}, {withCredentials: true})
                .catch((error) => { throw error; });

            setAuth({});
            navigate("/login");
        } catch (error) {
            errorReqHandler(error);
            
            //for development only
            setAuth({});
            navigate("/login");
        }
    }

	return (
        <Menu>
            <MenuButton className="group flex items-center text-gray-700 dark:text-gray-400" onClick={() => setIsOpen(isopen => !isopen)}>
                <span className="mr-3 overflow-hidden rounded-full bg-white border border-gray-200 group-hover:bg-gray-100 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:group-hover:bg-gray-800 dark:group-hover:text-white h-11 w-11">
                    <img src="/images/logo.png" alt="User" />
                </span>

                <span className="hidden md:block mr-1 font-medium text-sm">{auth.user.name ?? ""}</span>
                <ChevronDownIcon className={`size-4 text-gray-500 dark:text-gray-400 transition-transform duration-200 ${isOpen && "rotate-180"}`} />
            </MenuButton>

            <Dropdown anchor="bottom end" className="origin-top-right">
                <div>
		            <span className="block font-medium text-gray-700 text-sm dark:text-gray-400">
		            	{auth.user.name ?? ""}
		            </span>
		            <span className="mt-0.5 block text-xs text-gray-500 dark:text-gray-400">
		            	{auth.user.email ?? ""}
		            </span>
		        </div>

                <ul className="flex flex-col gap-1 py-3 border-b border-gray-200 dark:border-gray-800">
                    <DropdownItem as="a" href="/profile" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-white/5">
                        <UserCircleIcon className="size-6" />
                        Edit profile
                    </DropdownItem>
                    <DropdownItem as="a" href="/profile" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-white/5">
                        <Cog6ToothIcon className="size-6" />
                        Account settings
                    </DropdownItem>
                    <DropdownItem as="a" href="/profile" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-white/5">
                        <InformationCircleIcon className="size-6" />
                        Support
                    </DropdownItem>
                </ul>

                <form onSubmit={handleLogOut}>
                    <DropdownItem as="button" className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-white/5">
                        <ArrowLeftStartOnRectangleIcon className="size-6" />
                        Log Out
                    </DropdownItem>
                </form>
            </Dropdown>
        </Menu>
	);
}
