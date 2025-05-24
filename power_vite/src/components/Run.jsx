import useFirebase from "../hooks/useFirebase.jsx";
const Run= () => {
    const { email, loading } = useFirebase();
    return (
    <div>
        <h1>Run Game</h1>
        <p>ゲームの内容がここに表示されます。</p>
    </div>
    );
};

export default Run;