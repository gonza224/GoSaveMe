import React, { useRef, useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { ChatMessagesArea } from "@/Components/Chat/ChatMessagesArea";
import { ChatFormInput } from "@/Components/Chat/ChatFormInput";
import { useChatSession } from "@/hooks/useChatSession";
import { getDisplayName } from "../../lib/utils";

type ChatItem = {
  question: string;
  answer_type: "text" | "file";
  answer_text?: string;
  files?: File[];
};

const initialChatFormFields: ChatItem[] = [
  { question: "How can we help you?", answer_type: "text" },
];

const generationConfig = {
  temperature: 0.1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

const systemInstruction = `Imagine you are an Health AI agent trying to ask for more details from users/patients so that you can raise money for them just like gofundme. The way you should respond is this: Take input from user on their “problem”. They will describe their health issue, what happened to them, what have they faced, and how much cost they anticipate for their health issue. Based on their input, you will ask followup questions or documents or information for verification of their health related issues. For now let’s consider there are only 3 health problems in the world. 1. Heart related 2. Bone related 3. Brain related If you see anything related to the above problems (meaning words like heart, bone, and brain), you’ll ask followup questions as outlined in Follow-Up Rules below. For anything else, just give me “I cannot help with that” back (type: text). Follow-Up Rules: You will have to randomly ask random number of questions (number of questions should range from 3 to 7) for every case in a random order, but you WILL ALWAYS need to ask question number 5 and question number 6 mentioned below (however the questions should be asked in a random order). For example: for some cases, you can ask 4 questions, for others you can ask 5, or for other cases, you can ask 7 questions. 1. What’s your hospital name and their contact info? (Type: text) 2. Please upload your medical history records. (Type: file) 3. Please describe your treatment or recovery plan. (Type: text) 5. Please give contact information of community leader or personnel who can verify your case. (Type: text) 5. Scan document: (type: file) — If it ”Brain” related, ask “Please upload your functional MRI (fMRI)” — If it ”Heart” related, ask “Please upload your electrocardiogram (ECG)” — If it ”Bone” related, ask “Please upload your X-ray” 6. Whats your health payment deadline (MM/DD/YYYY)? 7. Please give us any further information you might think is necessary for verification purpose. (Type: text) It is EXTREMELY IMPORTANT to randomize the order of the questions you ask, as well as the number of questions you ask. Give me every single response in json format as list: {“question”:” . . . . ”, “answer_type”: “ . . . ”} question should be the question you chose. Type should be the type as I originally gave you here earlier.`;

export default function Index() {
  const [chatFormFields, setChatFormFields] = useState<ChatItem[]>(initialChatFormFields);
  const [messages, setMessages] = useState<{ role: "assistant" | "user"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const { data, setData, post, processing } = useForm<{ items: ChatItem[] }>({ items: [] });
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState(0);

  const messagesRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const { sendMessage } = useChatSession(
    import.meta.env.VITE_GEMINI_API_KEY,
    systemInstruction,
    generationConfig
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0 && chatFormFields.length > 0) {
      setMessages([{ role: "assistant", content: chatFormFields[0].question }]);
    }
  }, [messages, chatFormFields]);

  const resetForm = () => {
    setData("items", []);
    setInput("");
    setSelectedFiles([]);
  };

  useEffect(() => {
    if (!isComplete && data.items.length === chatFormFields.length && !processing) {
      post(route("chat.store"), {
        preserveState: true,
        preserveScroll: true,
        onSuccess: () => {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: "Thanks! Your request has been submitted." },
          ]);
          setIsComplete(true);
        },
        onError: () => {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: "Something went wrong filing your request." },
          ]);
        },
      });
      resetForm();
    }
  }, [data.items, processing, post, chatFormFields.length, isComplete]);

  const handleUserSubmit = async () => {
    const trimmedInput = input.trim();
    if (!trimmedInput && selectedFiles.length === 0) return;

    const currentField = chatFormFields[currentStep];
    const isFileQuestion = currentField.answer_type === "file";

    if (isFileQuestion && selectedFiles[0]) {
      setMessages((prev) => [
        ...prev,
        { role: "user", content: getDisplayName(selectedFiles[0], 15) },
      ]);
    } else if (!isFileQuestion && trimmedInput) {
      setMessages((prev) => [...prev, { role: "user", content: trimmedInput }]);
    }

    setInput("");
    setSelectedFiles([]);

    if (currentStep === 0) {
      try {
        const responseText = await sendMessage(trimmedInput);
        const cleanedText = responseText
          .trim()
          .replace(/^```json\s*/, "")
          .replace(/\s*```$/, "");
        const parsedData: ChatItem[] = JSON.parse(cleanedText);
        setChatFormFields((prev) => {
          const updatedFields = [...prev, ...parsedData];
          const nextStep = currentStep + 1;
          if (nextStep < updatedFields.length) {
            setMessages((prev) => [
              ...prev,
              { role: "assistant", content: updatedFields[nextStep].question },
            ]);
            setCurrentStep(nextStep);
          }
          return updatedFields;
        });
      } catch (error) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: "Sorry, we are unable to help you with that request." },
        ]);
        setIsComplete(true);
      }
    }

    const newItem: ChatItem = {
      question: currentField.question,
      answer_type: currentField.answer_type,
      ...(isFileQuestion ? { files: selectedFiles } : { answer_text: trimmedInput }),
    };

    const newItems = [...data.items, newItem];
    setData("items", newItems);

    if (currentStep < chatFormFields.length - 1) {
      if (currentStep !== 0) {
        const nextStep = currentStep + 1;
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: chatFormFields[nextStep].question },
        ]);
        setCurrentStep(nextStep);
      }
    }
  };

  const handleSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isComplete && !processing) {
      handleUserSubmit();
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (
        isComplete ||
        (chatFormFields[currentStep].answer_type === "text" && !input.trim()) ||
        (chatFormFields[currentStep].answer_type === "file" && selectedFiles.length === 0) ||
        processing
      ) {
        return;
      }
      handleUserSubmit();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <main className="flex h-screen w-full max-w-3xl flex-col items-center mx-auto">
      <ChatMessagesArea messages={messages} messagesRef={messagesRef} bottomRef={bottomRef} />
      <ChatFormInput
        input={input}
        setInput={setInput}
        onKeyDown={onKeyDown}
        onChange={(e) => setInput(e.target.value)}
        handleSubmit={handleSubmitForm}
        selectedFiles={selectedFiles}
        onFileChange={handleFileChange}
        removeFile={removeFile}
        isComplete={isComplete}
        currentFieldAnswerType={chatFormFields[currentStep].answer_type}
        processing={processing}
      />
    </main>
  );
}
