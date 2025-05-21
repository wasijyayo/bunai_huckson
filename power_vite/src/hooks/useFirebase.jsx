import { useEffect,useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import { signInAnonymously, signInWithEmailAndPassword,signOut} from "firebase/auth";
import { auth,db } from "../firebase.js";
import { collection,getDocs,query,where } from "firebase/firestore";
import {doc ,updateDoc,deleteDoc,addDoc,serverTimestamp} from "firebase/firestore";

const useFirebase = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState(null);
    const [learnings, setLearnings] = useState([]); // ✅ 学習データを格納するためのステートを追加
    const navigate = useNavigate();
    const toast = useToast();

    // ログイン処理
    const handleLogin = async (e) => {
        e.preventDefault(); // ページリロードを防ぐ
        setLoading(true);
        try {
            const userLogin = await signInWithEmailAndPassword(auth, email, password);
            console.log("User Logined:", userLogin.user.email);
            toast({
                title: "ログイン成功",
                position: "top",
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
    
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
            if (user) {
                setEmail(user.email);
                fetchDb(user.email); // ✅ ユーザーのメールアドレスを渡す
            } else {
                const authNotRequiredPaths = ["/login", "/register", "/sendReset"];
                const currentPath = window.location.pathname;

                // ✅ ログインが必要なページの場合、ログイン画面へ遷移
                if (!authNotRequiredPaths.includes(currentPath)) {
                    navigate("/login");
                }
            }
        });

        return () => unsubscribe(); // ✅ 正しく監視を解除
    }, []);
    
    const fetchDb = async (email) => {
    setLoading(true);
    try {
        const userCollectionRef = collection(db, email);//コレクション参照
        const q = query(userCollectionRef);
        const querySnapshot = await getDocs(q);
        const fetchedLearnings = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        console.log("取得したデータ:", fetchedLearnings); // ✅ 最終的なデータの確認
        setLearnings(fetchedLearnings);
    } catch (error) {
        console.error("データ取得エラー:", error); // 🚨 Firebase からエラーをキャッチ
    } finally {
        setLoading(false);
    }
};


    //データベースを参照して学習記録の合計を算出
    const calculateTotalTime = () => {
    if (!learnings || learnings.length === 0) {
        console.warn("learnings が空、または未定義です"); // ✅ デバッグ用
        return 0;
    }

    return learnings.reduce((total, item) => total + (item?.time || 0), 0); // ✅ `undefined` を防ぐ
};
    //更新した際に以下のフィールドを更新する
    const updateDb = async (editLearning) => {
        try{
            const docRef = doc(db, email, editLearning.id);
            await updateDoc(docRef, {
                title: editLearning.title,
                time: Number(editLearning.time),
                date : Number(editLearning.date),
            });
        }
        catch (error) {
            console.error("データ更新エラー:", error); // 🚨 Firebase からエラーをキャッチ
        }
    };
    //ドキュメントを削除する関数
    const deleteDb = async (documentId) => {
        try 
        {
            const docRef = doc(db,email,documentId);
            await deleteDoc(docRef);
            await fetchDb(email); // ✅ データを再取得
        }
        catch (error) {
            console.error("データ削除エラー:", error); // 🚨 Firebase からエラーをキャッチ
        };
    }
    //データを追加する関数
    const handCreate = async (newLearning) =>{
        try {
            const docRef = collection(db,email);
            await addDoc(docRef, {
                title: newLearning.title,
                time: Number(newLearning.time),
                date : Number(newLearning.date),
                createAt: serverTimestamp(),
            });
            await fetchDb(email); // ✅ データを再取得
            toast({
                title: "データを追加しました!",
                status: "success",
                duration: 3000,
                isClosable: true
            });
        }
        catch (error) {
            console.error("データ追加エラー:", error); // 🚨 Firebase からエラーをキャッチ
            toast({
                title: "データの追加に失敗しました",
                status: "error",
                duration: 3000,
                isClosable: true
            });
        }
    };
    //ログアウト機能実装
    const logout = async () =>{
        try {
            await signOut(auth);//Firebaseからサインアウト
            toast({
                title: "ログアウトしました",
                position: "top",
                status: "success",
                duration: 2000,
                isClosable: true,
            });
        }
        catch (error) {
            console.error("Logout error", error); // ✅ console.error に修正
            toast({
                title: "ログアウト失敗",
                position: "top",
                status: "error",
                duration: 2000,
                isClosable: true,
            });
        }
    };
    //ゲストログイン機能実装
    const gestLogin = async () => {
        try {
            const userLogin = await signInAnonymously(auth);
        }
        catch (error)
        {
            console.error("匿名ログインエラー:", error);
        }
    };

    return { // ✅ 他コンポーネントで使うための `return`
        loading,
        setLoading,
        email,
        setEmail,
        password,
        setPassword,
        handleLogin,
        user,
        learnings,
        fetchDb,
        calculateTotalTime,
        setLearnings,
        email,
        updateDb,
        deleteDb,
        handCreate,
        logout,
        gestLogin,
    };
};
export default useFirebase;