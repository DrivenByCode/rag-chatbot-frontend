export type MessageRole = 'user' | 'bot';

export interface Message {
    role: MessageRole;
    content: string;
}

export interface ChatMessage {
    id: string;
    content: string;
    role: MessageRole;
    timestamp: number;
    isError?: boolean;
}

export interface ChatSession {
    id: string;
    title?: string;
    messages: ChatMessage[];
    createdAt: number;
    updatedAt: number;
    userIdentifier?: string;
}

export interface ChatWidgetConfig {
    apiUrl?: string;
    userIdentifier?: string;
    sessionId?: string;
    initialMessages?: ChatMessage[];
    theme?: 'light' | 'dark' | 'auto';
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
    width?: string | number;
    height?: string | number;
    title?: string;
    placeholder?: string;
    showHeader?: boolean;
    showCloseButton?: boolean;
    showRestartButton?: boolean;
    persistSession?: boolean;
    containerStyle?: React.CSSProperties;
    headerStyle?: React.CSSProperties;
    bubbleStyle?: React.CSSProperties;
    inputStyle?: React.CSSProperties;
    onMessageSent?: (message: ChatMessage) => void;
    onMessageReceived?: (message: ChatMessage) => void;
    onError?: (error: Error) => void;
}

export interface ChatHookOptions {
    apiUrl?: string;
    userIdentifier?: string;
    sessionId?: string;
    initialMessages?: ChatMessage[];
    persistSession?: boolean;
    onMessageSent?: (message: ChatMessage) => void;
    onMessageReceived?: (message: ChatMessage) => void;
    onError?: (error: Error) => void;
}