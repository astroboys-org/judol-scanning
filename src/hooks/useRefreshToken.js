import { useAuth } from "../context/AuthContext";
import req from "../req/req";

export default function useRefreshToken() {
    const { setAuth } = useAuth();

    const refresh = async () => {
        const res = await req.get('/refresh', {withCredentials: true});
        setAuth(prev => {
            console.log(JSON.stringify(prev));
            console.log(res.data.accessToken);
            return {...prev, accessToken: res.data.accessToken}
        });

        return res.data.accessToken;
    }

    return refresh;
}