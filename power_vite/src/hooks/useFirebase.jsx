import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase.js";

export const useFirebase = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const toast = useToast();

    // ログイン処理
    const handleLogin = async (e) => {
        e.preventDefault(); // ページリロードを防ぐ
        setLoading(true);
        try {
            const userLogin = await signInWithEmailAndPassword(auth, email, password);
            console.log("User Logined:", userLogin);
            toast({
                title: "ログイン成功",
                position: "top", //
                status: "success",
                duration: 2000,
                isClosable: true,
            });
            navigate("/"); // ✅ トップページに遷移
        } catch (error) {
            console.error("Login error", error); // ✅ console.error に修正
            toast({
                title: "ログイン失敗",
                position: "top",
                status: "error",
                duration: 2000,
                isClosable: true,
            });
        } finally {
            setLoading(false);
        }
    };

    return { // ✅ 他コンポーネントで使うための `return`
        loading,
        setLoading,
        email,
        setEmail,
        password,
        setPassword,
        handleLogin
    };
};
export default useFirebase;