import { SidebarProvider, useSidebar } from "../../context/SidebarContext";
import { Navigate, Outlet, useLocation } from "react-router";
import AppHeader from "./AppHeader";
import Backdrop from "../Backdrop";
import AppSidebar from "./AppSidebar";
import { useAuth } from "../../context/AuthContext";
import Loader from "../../components/ui/Loader";
import { usePageLoader } from "../../context/PageLoaderContext";

function LayoutContent() {
    const { isExpanded, isHovered, isMobileOpen } = useSidebar();
    const { isPageLoading } = usePageLoader();

    return (
        <div className="min-h-screen xl:flex">
            <div>
                <AppSidebar />
                <Backdrop />
            </div>
            <div className={`relative flex-1 transition-all duration-300 ease-in-out ${isExpanded || isHovered ? "lg:ml-64" : "lg:ml-20"} ${isMobileOpen ? "ml-0" : ""}`}>
                <AppHeader />
                <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
                    {isPageLoading && <div className="absolute top-0 left-0 flex justify-center items-center w-full h-screen inset-0 z-40 bg-gray-900/50">
                        <Loader className="z-[99]" />
                    </div>}
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default function AppLayout() {
    const { auth } = useAuth();
    const location = useLocation();

    return (
        auth?.user
            ? <SidebarProvider>
                <LayoutContent />
            </SidebarProvider>
            : <Navigate to="/login" state={{from: location}} replace />
    );
};
