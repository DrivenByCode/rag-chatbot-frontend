import { useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import {
    setConfig,
    createSession,
    setCurrentSession,
    sendMessageStart,
    sendMessageSuccess,
    sendMessageFailure,
    clearSession
} from '@/store/slices/chatSlice';
import { RootState } from '@/store';
import { ChatHookOptions } from '@/types/chat';
import { useAppDispatch } from "@/hooks/reduxHooks";

export const useChatWidget = (options: ChatHookOptions = {}) => {
    const dispatch = useAppDispatch();
    const {
        apiUrl,
        userIdentifier,
        sessionId,
        initialMessages,
        onMessageSent,
        onMessageReceived,
        onError
    } = options;

    const {
        sessions,
        currentSessionId,  // activeSessionId → currentSessionId로 변경
        isLoading,         // loading → isLoading으로 변경
        error,
        config
    } = useSelector((state: RootState) => state.chat);

    // 초기화
    useEffect(() => {
        // initializeChat 대신 setConfig 사용
        dispatch(setConfig({
            apiUrl,
            userIdentifier
        }));

        // 세션 ID가 있으면 해당 세션 설정, 없으면 새 세션 생성
        if (sessionId) {
            dispatch(setCurrentSession(sessionId));
        } else {
            dispatch(createSession({ initialMessages }));
        }
    }, [dispatch, apiUrl, userIdentifier, sessionId]);

    // 에러 처리
    useEffect(() => {
        if (error && onError) {
            onError(new Error(error));
        }
    }, [error, onError]);

    // 활성 세션 데이터
    const activeSession = currentSessionId ? sessions.find(s => s.id === currentSessionId) : null;
    const messages = activeSession ? activeSession.messages : [];

    // 메시지 전송
    const sendChatMessage = useCallback(async (content: string) => {
        if (!currentSessionId || !content.trim()) return;

        // 메시지 전송 시작
        dispatch(sendMessageStart({ content }));

        if (onMessageSent) {
            // 가장 최근 유저 메시지를 찾아서 onMessageSent 콜백 호출
            const session = sessions.find(s => s.id === currentSessionId);
            if (session) {
                const userMessage = session.messages[session.messages.length - 1];
                if (userMessage.role === 'user') {
                    onMessageSent(userMessage);
                }
            }
        }

        // API 통신이 필요한 경우
        if (config.apiUrl) {
            try {
                // API 호출 로직 - 실제 구현에 맞게 조정 필요
                const response = await fetch(`${config.apiUrl}/api/chat`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        sessionId: currentSessionId,
                        message: content,
                        userIdentifier: config.userIdentifier
                    }),
                });

                if (!response.ok) {
                    throw new Error('API 응답 오류');
                }

                const data = await response.json();
                dispatch(sendMessageSuccess({ response: data.response }));

                // 콜백 실행
                if (onMessageReceived) {
                    const session = sessions.find(s => s.id === currentSessionId);
                    if (session) {
                        const latestMessage = session.messages[session.messages.length - 1];
                        if (latestMessage.role === 'assistant') {
                            onMessageReceived(latestMessage);
                        }
                    }
                }
            } catch (err) {
                // 오류 처리
                const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류';
                dispatch(sendMessageFailure(errorMessage));

                if (onError && err instanceof Error) {
                    onError(err);
                }
            }
        }
    }, [currentSessionId, dispatch, config.apiUrl, config.userIdentifier, onMessageSent, onMessageReceived, onError, sessions]);

    // 새 세션 생성
    const startNewChat = useCallback(() => {
        dispatch(createSession({ initialMessages: [] }));
    }, [dispatch]);

    // 세션 초기화
    const resetChat = useCallback(() => {
        if (currentSessionId) {
            dispatch(clearSession(currentSessionId));
        }
    }, [currentSessionId, dispatch]);

    // 사용자 ID 설정
    const updateUserIdentifier = useCallback((id: string) => {
        dispatch(setConfig({ userIdentifier: id }));
    }, [dispatch]);

    return {
        messages,
        activeSessionId: currentSessionId,
        sendMessage: sendChatMessage,
        startNewChat,
        resetChat,
        loading: isLoading,
        error,
        setUserIdentifier: updateUserIdentifier,
    };
};