import {useFirebase} from "../hooks/useFirebase";
const StudyDate =() => {
    const {learnings} = useFirebase();

    return(
        <div>
            <h2>学習データ</h2>
            <ul>
                {learnings.map((item) => (
                    <li key={item.id}>
                        <strong>{item.title}</strong> - {item.date} 分
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default StudyDate;