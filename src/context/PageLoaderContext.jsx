import { createContext, useContext, useState } from "react";

const PageLoaderContext = createContext(null);

export const usePageLoader = () => {
    const context = useContext(PageLoaderContext);
    if (!context) {
        throw new Error("usePageLoader must be used within a PageLoaderProvider");
    }
    return context;
}

export function PageLoaderProvider({children}) {
    const [isPageLoading, setIsPageLoading] = useState(false);

    return (
        <PageLoaderContext.Provider value={{isPageLoading, setIsPageLoading}}>
            {children}
        </PageLoaderContext.Provider>
    )
}