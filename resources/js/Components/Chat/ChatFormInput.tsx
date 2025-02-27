import React from "react";
import { ChatInput } from "@/components/ui/chat/chat-input";
import { Button } from "@/components/ui/button";
import { Paperclip, CornerDownLeft, X } from "lucide-react";
import { getDisplayName } from "../../lib/utils";

type Props = {
    input: string;
    setInput: (value: string) => void;
    onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement>;
    onChange: React.ChangeEventHandler<HTMLTextAreaElement>;
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    selectedFiles: File[];
    onFileChange: React.ChangeEventHandler<HTMLInputElement>;
    removeFile: (index: number) => void;
    isComplete: boolean;
    currentFieldAnswerType: "text" | "file";
    processing: boolean;
};

export function ChatFormInput({
    input,
    setInput,
    onKeyDown,
    onChange,
    handleSubmit,
    selectedFiles,
    onFileChange,
    removeFile,
    isComplete,
    currentFieldAnswerType,
    processing,
}: Props) {
    return (
        <div className="w-full px-4 pb-4">
            <form
                onSubmit={handleSubmit}
                className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
                encType="multipart/form-data"
            >
                <ChatInput
                    value={input}
                    onKeyDown={onKeyDown}
                    onChange={onChange}
                    placeholder={isComplete ? "This conversation has finalized..." : "Type your answer..."}
                    className="bg-background border-0 shadow-none focus-visible:ring-0"
                    disabled={isComplete}
                />
                <div className="flex items-center p-3 pt-0">
                    <Button
                        asChild
                        disabled={currentFieldAnswerType !== "file"}
                        variant="outline"
                        size="icon"
                        className="rounded"
                    >
                        <label
                            className={`cursor-pointer ${currentFieldAnswerType !== "file" || isComplete
                                    ? "opacity-50 pointer-events-none"
                                    : ""
                                }`}
                        >
                            <Paperclip className="size-4" />
                            <span className="sr-only">Attach file</span>
                            <input
                                type="file"
                                multiple
                                disabled={currentFieldAnswerType !== "file" || isComplete}
                                accept="application/pdf,image/*"
                                className="sr-only"
                                onChange={onFileChange}
                            />
                        </label>
                    </Button>
                    <Button
                        type="submit"
                        size="sm"
                        className="ml-auto gap-1.5 rounded"
                        disabled={
                            isComplete ||
                            (currentFieldAnswerType === "text" && !input.trim()) ||
                            (currentFieldAnswerType === "file" && selectedFiles.length === 0) ||
                            processing
                        }
                    >
                        Send
                        <CornerDownLeft className="size-3.5" />
                    </Button>
                </div>
                {selectedFiles.length > 0 && (
                    <div className="px-3 pb-3 flex flex-wrap gap-2">
                        {selectedFiles.map((file, idx) => {
                            const filename = getDisplayName(file);
                            return (
                                <div
                                    key={idx}
                                    className="flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs"
                                >
                                    <span className="truncate max-w-[100px]" title={file.name}>
                                        {filename}
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="p-0 text-foreground"
                                        onClick={() => removeFile(idx)}
                                    >
                                        <X className="h-3 w-3" />
                                    </Button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </form>
        </div>
    );
}
