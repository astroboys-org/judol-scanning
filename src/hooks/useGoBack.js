import { useNavigate } from "react-router";

export default function useGoBack() {
    const navigate = useNavigate();

    const goBack = () => {
        if (window.history.state && window.history.state.idx > 0) {
            navigate(-1);
        } else {
            navigate("/");
        }
    };

    return goBack;
};
