/*import { useState } from "react";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY, // .env.localから取得
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

const Gimini = () => {
    const [result, setResult] = useState("");

    const handleTest = async () => {
        try {
            const response = await openai.chat.completions.create({
                model: "gemini-2.5-flash-preview-04-17",
                reasoning_effort: "low",
                messages: [
                    { role: "system", content: "You are a helpful assistant." },
                    { role: "user", content: "Explain to me how AI works" },
                ],
            });
            setResult(response.choices[0].message.content);
        } catch (e) {
            setResult("エラー: " + e.message);
        }
    };

    return (
        <div>
            <button onClick={handleTest}>Geminiテスト実行</button>
            <div>{result}</div>
        </div>
    );
};

export default Gimini;*/