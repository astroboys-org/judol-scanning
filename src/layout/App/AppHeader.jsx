import { useEffect, useRef, useState } from "react";

import { Link } from "react-router";
import { useSidebar } from "../../context/SidebarContext";
import { ThemeToggleButton } from "../../components/common/ThemeToggleButton";
import NotificationDropdown from "../../components/header/NotificationDropdown";
import UserDropdown from "../../components/header/UserDropdown";
import { Bars3CenterLeftIcon, EllipsisVerticalIcon, MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function AppHeader() {
    const [isApplicationMenuOpen, setApplicationMenuOpen] = useState(false);

    const { isMobileOpen, toggleSidebar, toggleMobileSidebar } = useSidebar();

    const handleToggle = () => {
        if (window.innerWidth >= 1024) {
            toggleSidebar();
        } else {
            toggleMobileSidebar();
        }
    };

    const toggleApplicationMenu = () => {
        setApplicationMenuOpen(!isApplicationMenuOpen);
    };

    const inputRef = useRef(null);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if ((event.metaKey || event.ctrlKey) && event.key === "k") {
                event.preventDefault();
                inputRef.current?.focus();
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <header className="sticky top-0 flex w-full bg-white border-gray-200 z-[99] dark:border-gray-800 dark:bg-gray-900 lg:border-b">
            <div className="flex flex-col items-center justify-between grow lg:flex-row lg:px-6">
                <div className="flex items-center justify-between w-full gap-2 px-3 py-3 border-b border-gray-200 dark:border-gray-800 sm:gap-4 lg:justify-normal lg:border-b-0 lg:px-0 lg:py-4">
                    <button onClick={handleToggle} aria-label="Toggle Sidebar"
                        className="items-center justify-center w-10 h-10 text-gray-500 border-gray-200 rounded-lg z-[99] dark:border-gray-800 dark:text-gray-400 lg:flex lg:h-11 lg:w-11 lg:border"
                    >
                        {isMobileOpen ? (
                            <XMarkIcon className="size-6" />
                        ) : (
                            <Bars3CenterLeftIcon className="size-6" />
                        )}
                    </button>

                    <div className="flex lg:hidden items-center lg:gap-2">
                        <Link to="/">
                            <img src="./images/logo.png" alt="Logo" className="h-8 w-auto object-contain" />
                        </Link>
                    </div>

                    <button onClick={toggleApplicationMenu}
                        className="flex items-center justify-center w-10 h-10 text-gray-700 rounded-lg z-9 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 lg:hidden"
                    >
                        <EllipsisVerticalIcon className="size-6" />
                    </button>

                    <div className="hidden lg:block">
                        <form>
                            <div className="relative">
                                <MagnifyingGlassIcon className="text-gray-400 absolute top-1/2 left-4 -translate-y-1/2 pointer-events-none size-6" />
                                <input
                                    ref={inputRef}
                                    type="text"
                                    placeholder="Search or type command..."
                                    className="dark:bg-dark-900 h-11 w-full rounded-lg border border-gray-200 bg-transparent py-2.5 pl-12 pr-14 text-sm text-gray-800 shadow-theme-xs placeholder:text-gray-400 focus:border-blue-300 focus:outline-hidden focus:ring-3 focus:ring-blue-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white/90 dark:placeholder:text-white/30 dark:focus:border-blue-800 xl:w-[430px]"
                                />

                                <button className="absolute right-2.5 top-1/2 inline-flex -translate-y-1/2 items-center gap-0.5 rounded-lg border border-gray-200 bg-gray-50 px-[7px] py-[4.5px] text-xs -tracking-[0.2px] text-gray-500 dark:border-gray-800 dark:bg-white/[0.03] dark:text-gray-400">
                                    <span> Ctrl + K </span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className={`${isApplicationMenuOpen ? "flex opacity-100" : "hidden opacity-0"} absolute top-0 right-2 lg:relative items-center justify-between gap-4 bg-white dark:bg-gray-700 dark:lg:bg-transparent rounded-2xl lg:rounded-none border border-gray-200 dark:border-gray-800 lg:border-none shadow-md lg:shadow-none w-[90vw] lg:w-full mt-18 lg:mt-0 px-5 py-4 lg:flex lg:opacity-100 lg:justify-end
                    transition transition-discrete duration-100 ease-linear`}>
                    <div className="flex items-center gap-2 2xsm:gap-3">
                        <ThemeToggleButton />
                        <NotificationDropdown />
                    </div>
                    <UserDropdown />
                </div>
            </div>
        </header>
    );
};
