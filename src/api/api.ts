import axios, { AxiosInstance } from 'axios';

// 동적 기본 URL 설정을 위한 함수
export const createApiClient = (baseUrl?: string): AxiosInstance => {
  // 기본 URL 결정: 전달된 baseUrl, 환경변수, 또는 현재 호스트 주소 사용
  const API_BASE_URL =
    baseUrl || import.meta.env.VITE_API_BASE_URL || window.location.origin;

  const apiClient = axios.create({
    baseURL: `${API_BASE_URL}/api`, // /api context-path 추가
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
