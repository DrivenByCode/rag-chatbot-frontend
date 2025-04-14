import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage, ChatSession } from '@/types/chat';

interface ChatState {
  sessions: ChatSession[];
  currentSessionId: string | null;
  isLoading: boolean;
  error: string | null;
  config: {
    apiUrl: string;
    userIdentifier?: string;
  };
}

const initialState: ChatState = {
  sessions: [],
  currentSessionId: null,
  isLoading: false,
  error: null,
  config: {
    apiUrl: window.location.origin,
  },
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // 설정 업데이트
    setConfig: (
      state,
      action: PayloadAction<{ apiUrl?: string; userIdentifier?: string }>,
    ) => {
      state.config = { ...state.config, ...action.payload };
    },
    // 새 세션 생성
    createSession: (
      state,
      action: PayloadAction<{ initialMessages?: ChatMessage[] }>,
    ) => {
      const sessionId = uuidv4();
      const newSession: ChatSession = {
        id: sessionId,
        messages: action.payload.initialMessages || [],
        createdAt: Date.now(),
        updatedAt: Date.now(),
        userIdentifier: state.config.userIdentifier,
      };

      state.sessions.push(newSession);
      state.currentSessionId = sessionId;
    },
    // 세션 전환
    setCurrentSession: (state, action: PayloadAction<string>) => {
      state.currentSessionId = action.payload;
    },
    // 메시지 요청 시작
    sendMessageStart: (state, action: PayloadAction<{ content: string }>) => {
      state.isLoading = true;

      if (!state.currentSessionId) {
        return;
      }

      const session = state.sessions.find(
        (s) => s.id === state.currentSessionId,
      );
      if (session) {
        const userMessage: ChatMessage = {
          id: uuidv4(),
          content: action.payload.content,
          role: 'user',
          timestamp: Date.now(),
        };

        session.messages.push(userMessage);
        session.updatedAt = Date.now();
      }
    },
    // 메시지 응답 성공
    sendMessageSuccess: (
      state,
      action: PayloadAction<{ response: string }>,
    ) => {
      state.isLoading = false;
      state.error = null;

      if (!state.currentSessionId) {
        return;
      }

      const session = state.sessions.find(
        (s) => s.id === state.currentSessionId,
      );
      if (session) {
        const assistantMessage: ChatMessage = {
          id: uuidv4(),
          content: action.payload.response,
          role: 'bot',
          timestamp: Date.now(),
        };

        session.messages.push(assistantMessage);
        session.updatedAt = Date.now();
      }
    },
    // 메시지 응답 실패
    sendMessageFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.error = action.payload;

      if (!state.currentSessionId) {
        return;
      }

      const session = state.sessions.find(
        (s) => s.id === state.currentSessionId,
      );
      if (session) {
        const errorMessage: ChatMessage = {
          id: uuidv4(),
          content:
            '죄송합니다, 메시지 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
          role: 'bot',
          timestamp: Date.now(),
          isError: true,
        };

        session.messages.push(errorMessage);
        session.updatedAt = Date.now();
      }
    },
    // 세션 초기화
    clearSession: (state, action: PayloadAction<string>) => {
      const sessionIndex = state.sessions.findIndex(
        (s) => s.id === action.payload,
      );
      if (sessionIndex !== -1) {
        // 세션의 메시지만 초기화
        state.sessions[sessionIndex].messages = [];
        state.sessions[sessionIndex].updatedAt = Date.now();
      }
    },
    // 세션 삭제
    deleteSession: (state, action: PayloadAction<string>) => {
      state.sessions = state.sessions.filter((s) => s.id !== action.payload);

      // 현재 세션이 삭제된 경우 다른 세션으로 전환
      if (state.currentSessionId === action.payload) {
        state.currentSessionId =
          state.sessions.length > 0 ? state.sessions[0].id : null;
      }
    },
  },
});

export const {
  setConfig,
  createSession,
  setCurrentSession,
  sendMessageStart,
  sendMessageSuccess,
  sendMessageFailure,
  clearSession,
} = chatSlice.actions;

export default chatSlice.reducer;
