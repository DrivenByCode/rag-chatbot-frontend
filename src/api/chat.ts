import axios, { AxiosInstance } from 'axios';

// 동적 기본 URL 설정을 위한 함수
export const createApiClient = (baseUrl?: string): AxiosInstance => {
  // 기본 URL 결정: 전달된 baseUrl, 환경변수, 또는 현재 호스트 주소 사용
  const API_BASE_URL =
    baseUrl || import.meta.env.VITE_API_BASE_URL || window.location.origin;

  const apiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
      'Content-Type': 'text/plain',
    },
  });

  // 요청 인터셉터
  apiClient.interceptors.request.use(
    (config) => {
      console.log(`API 요청: ${config.method?.toUpperCase()} ${config.url}`);
      return config;
    },
    (error) => {
      console.error('API 요청 인터셉터 오류:', error);
      return Promise.reject(error);
    },
  );

  // 응답 인터셉터
  apiClient.interceptors.response.use(
    (response) => {
      console.log(`API 응답 성공: ${response.status}`);
      return response;
    },
    (error) => {
      console.error('API 응답 인터셉터 오류:', error);
      if (axios.isAxiosError(error)) {
        console.error('API 에러 상세:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
        });
      }
      return Promise.reject(error);
    },
  );

  return apiClient;
};

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
