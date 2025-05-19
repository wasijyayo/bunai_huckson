
import  useFirebase  from "../hooks/useFirebase.jsx";//firebaseのフックをインポート
const Kuizu = () => {
    const { loading, email, setEmail, password, setPassword, handleLogin } = useFirebase()
    //useFirebaseのインポート
    return(
       <h1>hello</h1>
    )
};
export default Kuizu;