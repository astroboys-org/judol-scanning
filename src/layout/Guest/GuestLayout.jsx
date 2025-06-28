import { SidebarProvider, useSidebar } from "../../context/SidebarContext";
import { Outlet } from "react-router";
import GuestHeader from "./GuestHeader";
import { useAuth } from "../../context/AuthContext";
import GuestSidebar from "./GuestSidebar";
import Backdrop from "../Backdrop";
import { usePageLoader } from "../../context/PageLoaderContext";

function LayoutContent() {
    const { isPageLoading } = usePageLoader();

    return (
        <div className="min-h-screen xl:flex">
            {/* <div>
                <GuestSidebar />
                <Backdrop />
            </div> */}
            <div className={`relative flex-col transition-all duration-300 ease-in-out`}>
                <GuestHeader />
                <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
                    {isPageLoading && <div className="absolute top-0 left-0 flex justify-center items-center w-full h-screen inset-0 z-40 bg-gray-900/50">
                        <Loader className="z-[99]" />
                    </div>}
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default function GuestLayout() {
    const { auth } = useAuth();
    return (
        !auth?.user
            ? <SidebarProvider>
                <LayoutContent />
            </SidebarProvider>
            : <Navigate to="/dashboard" replace />
    );
};
