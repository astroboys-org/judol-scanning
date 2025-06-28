import { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { reqPrivate } from "../req/req";
import useRefreshToken from "./useRefreshToken";

export default function useReqPrivate() {
    const refresh = useRefreshToken();
    const { auth } = useAuth();

    useEffect(() => {
        const reqIntercept = reqPrivate.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
                }

                return config;
            }, (error) => Promise.reject(error)
        )

        const resIntercept = reqPrivate.interceptors.response.use(
            res => res,
            async (error) => {
                const prevReq = error?.config;
                if (error?.response?.status === 403 && !prevReq?.sent) {
                    prevReq.sent = true;
                    const newAccessToken = await refresh();
                    prevReq.headers['Authorization'] = `Bearer ${newAccessToken}`;
                    return reqPrivate(prevReq);
                }

                return Promise.reject(error);
            }
        );

        return () => {
            reqPrivate.interceptors.request.eject(reqIntercept);
            reqPrivate.interceptors.response.eject(resIntercept);
        }
    }, [auth, refresh]);

    return reqPrivate;
}