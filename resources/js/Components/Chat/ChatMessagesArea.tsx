import React from "react";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from "@/components/ui/chat/chat-bubble";
import { ScrollArea } from "@/components/ui/scroll-area";
import logo from "@/../images/logo.jpg";

type Message = { role: "assistant" | "user"; content: string };

type Props = {
    messages: Message[];
    messagesRef: React.RefObject<HTMLDivElement>;
    bottomRef: React.RefObject<HTMLDivElement>;
};

export function ChatMessagesArea({ messages, messagesRef, bottomRef }: Props) {
    return (
        <ScrollArea ref={messagesRef} className="flex-1 w-full overflow-y-auto py-6">
            <ChatMessageList>
                {messages.map((msg, idx) => (
                    <ChatBubble key={idx} variant={msg.role === "user" ? "sent" : "received"}>
                        <ChatBubbleAvatar
                            src={msg.role === "user" ? "" : logo}
                            fallback={msg.role === "user" ? "👤" : "💬"}
                        />
                        <ChatBubbleMessage className="rounded">
                            <p>{msg.content}</p>
                        </ChatBubbleMessage>
                    </ChatBubble>
                ))}
            </ChatMessageList>
            <div ref={bottomRef} />
        </ScrollArea>
    );
}
