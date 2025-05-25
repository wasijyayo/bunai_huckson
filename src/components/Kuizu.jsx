
import  useFirebase  from "../hooks/useFirebase.jsx";//firebaseのフックをインポート
const Kuizu = () => {
    const { loading, email, setEmail, password, setPassword, handleLogin } = useFirebase()
    //useFirebaseのインポート
    return
      const kotaeawase = () => {
        alert("答え合わせします！");
        // ここに答え合わせロジックを追加
    };

    return (
        <div>
            <h1>hello</h1>
            <input type="button" value="OK" onClick={kotaeawase} />
        </div>
    );
};

export default Kuizu;