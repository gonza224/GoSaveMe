import { useEffect, useRef } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

export function useChatSession(apiKey: string, systemInstruction: string, generationConfig: any) {
    const chatSessionRef = useRef<any>(null);

    useEffect(() => {
        if (!chatSessionRef.current) {
            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({
                model: "gemini-2.0-flash",
                systemInstruction,
            });
            chatSessionRef.current = model.startChat({
                generationConfig,
                history: [],
            });
        }
    }, [apiKey, systemInstruction, generationConfig]);

    const sendMessage = async (message: string) => {
        if (!chatSessionRef.current) return;
        const result = await chatSessionRef.current.sendMessage(message);
        const response = await result.response;
        const text = await response.text();
        return text;
    };

    return { sendMessage };
}
