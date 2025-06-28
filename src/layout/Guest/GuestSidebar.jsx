import { useCallback, useEffect, useState } from "react";
import { Link, useLocation } from "react-router";
import { useSidebar } from "../../context/SidebarContext";
import { ChevronDownIcon, ClipboardDocumentListIcon, EllipsisHorizontalIcon, HomeIcon, InboxStackIcon, ShieldExclamationIcon, UserCircleIcon } from "@heroicons/react/24/outline";
import { Transition } from "@headlessui/react";

const navItems = [
    {
        icon: <HomeIcon className="size-6" />,
        name: "Home",
        subItems: [{ name: "Home", path: "/" }],
    },
    {
        name: "Log In",
        icon: <UserCircleIcon className="size-6" />,
        path: "/login",
    },
    {
        icon: <ClipboardDocumentListIcon className="size-6" />,
        name: "Form Components",
        path: "/form-components",
    },
    {
        name: "Other Components",
        icon: <InboxStackIcon className="size-6" />,
        subItems: [
            { name: "Buttons", path: "/button-components" },
            { name: "Badges", path: "/badge-components" }
        ],
    },
    {
        name: "Others",
        icon: <ShieldExclamationIcon className="size-6" />,
        subItems: [
            { name: "404 Error", path: "/error-404" },
        ],
    },
];

export default function GuestSidebar() {
    const { isExpanded, isMobileOpen, isHovered, setIsHovered, toggleMobileSidebar } = useSidebar();
    const location = useLocation();

    const checkActive = useCallback(
        (path) => location.pathname === path,
        [location.pathname]
    );

    useEffect(() => {
        if (isMobileOpen) toggleMobileSidebar();
    }, [location]);

    return (
        <aside className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200
            ${isExpanded || isMobileOpen || isHovered ? "w-64" : "w-20"} ${isMobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
            onMouseEnter={() => !isExpanded && setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <Link to="/" className={`py-4 md:py-8 flex items-center gap-2 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
                <img src="./images/logo.png" alt="Logo" className={`${isExpanded || isHovered || isMobileOpen ? "h-10 object-contain" : "size-8 w-auto object-cover"} w-auto`} />
                
                <h5 className={`dark:text-white/90 font-bold uppercase ${isExpanded || isMobileOpen || isHovered ? 'inline-block' : 'hidden'}`}>
                    {import.meta.env.VITE_APP_NAME}
                </h5>
            </Link>

            <div className="flex flex-col overflow-y-auto duration-200 ease-linear no-scrollbar">
                <nav className="mb-6">
                    <div className="flex flex-col gap-4">
                        <div>
                            <h2 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
                                {isExpanded || isHovered || isMobileOpen ? (
                                    "Menu"
                                ) : (
                                    <EllipsisHorizontalIcon className="size-6" />
                                )}
                            </h2>
                            <ul className="flex flex-col gap-4">
                                {navItems.map((navItem, index) => (
                                    <li key={index}>
                                        <NavItem navItem={navItem} location={location} checkActive={checkActive} />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
        </aside>
    );
};

function NavItem({navItem, location, checkActive}) {
    const { isExpanded, isMobileOpen, isHovered } = useSidebar();

    const [isOpen, setIsOpen] = useState(false);
    const [isActive, setIsActive] = useState(false);

    const toggleOpen = () => {
        setIsOpen(prev => !prev);
    }

    useEffect(() => {
        if (navItem.subItems?.some(item => checkActive(item.path)) || checkActive(navItem?.path)) {
            setIsOpen(true);
            setIsActive(true);
        }

        return () => {
            setIsOpen(false);
            setIsActive(false);
        }
    },[location]);

    if (navItem.subItems)
        return (
            <div className="relative flex flex-col">
                <button className={`menu-item ${!isActive ? 'menu-item-inactive' : 'menu-item-active'} cursor-pointer lg:justify-start`} onClick={toggleOpen}>
                    <span className={`menu-item-icon-size ${!isActive ? 'menu-item-icon-inactive' : 'menu-item-icon-active'}`}>{navItem.icon}</span>
                    {(isExpanded || isHovered || isMobileOpen) && (
                        <span className="menu-item-text">{navItem.name}</span>
                    )}
                    {(isExpanded || isHovered || isMobileOpen) && (
                        <ChevronDownIcon className={`ml-auto size-5 transition-transform duration-200 ${isOpen && 'rotate-180 text-blue-500'}`} />
                    )}
                </button>

                <Transition show={isOpen}>
                    <div className="origin-top transition ease-linear data-closed:-translate-y-5 data-closed:opacity-0">
                        {navItem.subItems && (isExpanded || isHovered || isMobileOpen) && (
                            <div className="overflow-hidden transition-all duration-200">
                                <ul className="mt-2 space-y-1 ml-9">
                                    {navItem.subItems.map((subItem) => (
                                        <li key={subItem.name}>
                                            <Link to={subItem.path} className={`menu-dropdown-item ${checkActive(subItem.path) ? "menu-dropdown-item-active" : "menu-dropdown-item-inactive"}`}>
                                                {subItem.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </Transition>
            </div>
        )

    if (navItem.path)
        return (
            <Link to={navItem.path} className={`menu-item group ${checkActive(navItem.path) ? "menu-item-active" : "menu-item-inactive"}`}>
                <span className={`menu-item-icon-size ${checkActive(navItem.path) ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}>
                    {navItem.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                    <span className="menu-item-text">{navItem.name}</span>
                )}
            </Link>
        )
    
    return "";
}