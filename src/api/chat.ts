import axios, { AxiosInstance } from 'axios';
import { createApiClient } from './api';

// 채팅 API 서비스
export const chatApiService = {
  sendMessage: async (
    message: string,
    sessionId: string,
    apiClient: AxiosInstance,
  ): Promise<{
    success: boolean;
    response?: string;
  }> => {
    try {
      const response = await apiClient.post(
        `/chat/ask?sessionId=${sessionId}`,
        message,
      );

      if (response.data.finishReason === 'error') {
        console.warn('응답 생성 중 오류 발생:', response.data.reply);
      }

      return { success: true, response: response.data.reply };
    } catch (error) {
      console.error('채팅 메시지 전송 실패:', error);
      return { success: false };
    }
  },
};

// 사용의 편의를 위한 훅 함수
export function useChatApi(baseUrl?: string) {
  const apiClient = createApiClient(baseUrl);

  const sendChatMessage = async (
    message: string,
    sessionId: string,
  ): Promise<{
    success: boolean;
    response?: string;
  }> => {
    return chatApiService.sendMessage(message, sessionId, apiClient);
  };

  return { sendChatMessage };
}
