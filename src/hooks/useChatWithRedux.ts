import {useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  createSession,
  sendMessageFailure,
  sendMessageStart,
  sendMessageSuccess,
  setConfig,
} from '@/store/slices/chatSlice';
import {AppDispatch, RootState} from '@/store';
import {useChatApi} from '@/api/chat';
import {ChatMessage} from '@/types/chat';

interface UseChatOptions {
    apiUrl?: string;
    userIdentifier?: string;
    initialMessages?: ChatMessage[];
    onMessageSent?: (message: ChatMessage) => void;
    onMessageReceived?: (message: ChatMessage) => void;
    onError?: (error: Error) => void;
}

export const useChatWithRedux = (options: UseChatOptions = {}) => {
    const dispatch = useDispatch<AppDispatch>();
    const {currentSessionId, sessions, isLoading, error, config} = useSelector(
        (state: RootState) => state.chat,
    );

    const currentSession = useSelector((state: RootState) => {
        return state.chat.currentSessionId
            ? state.chat.sessions.find((s) => s.id === state.chat.currentSessionId)
            : null;
    });

    const {sendChatMessage} = useChatApi(options.apiUrl || config.apiUrl);

    // 설정 업데이트
    useEffect(() => {
        if (options.apiUrl || options.userIdentifier) {
            dispatch(
                setConfig({
                    apiUrl: options.apiUrl,
                    userIdentifier: options.userIdentifier,
                }),
            );
        }
    }, [dispatch, options.apiUrl, options.userIdentifier]);

    // 세션이 없으면 새 세션 생성
    useEffect(() => {
        if (!currentSessionId && sessions.length === 0) {
            dispatch(createSession({initialMessages: options.initialMessages}));
        }
    }, [currentSessionId, sessions.length, dispatch, options.initialMessages]);

    // 메시지 전송 함수
    const sendMessage = useCallback(
        async (content: string) => {
            if (!currentSessionId) return;

            try {
                dispatch(sendMessageStart({content}));

                // 전송된 메시지 콜백
                if (options.onMessageSent && currentSession) {
                    const lastMessage =
                        currentSession.messages[currentSession.messages.length - 1];
                    if (lastMessage && lastMessage.role === 'user') {
                        options.onMessageSent(lastMessage);
                    }
                }

                const result = await sendChatMessage(content, currentSessionId);

                if (result.success && result.response) {
                    dispatch(sendMessageSuccess({response: result.response}));

                    // 받은 메시지 콜백
                    if (options.onMessageReceived && currentSession) {
                        const messages = currentSession.messages;
                        const lastMessage = messages[messages.length - 1];
                        if (lastMessage && lastMessage.role === 'assistant') {
                            options.onMessageReceived(lastMessage);
                        }
                    }
                } else {
                    throw new Error('응답을 받지 못했습니다.');
                }
            } catch (err) {
                const errorMessage =
                    err instanceof Error
                        ? err.message
                        : '알 수 없는 오류가 발생했습니다.';
                dispatch(sendMessageFailure(errorMessage));

                if (options.onError && err instanceof Error) {
                    options.onError(err);
                }
            }
        },
        [currentSessionId, currentSession, dispatch, sendChatMessage, options],
    );

    return {
        sendMessage,
        messages: currentSession?.messages || [],
        isLoading,
        error,
        sessionId: currentSessionId,
        config,
    };
};
