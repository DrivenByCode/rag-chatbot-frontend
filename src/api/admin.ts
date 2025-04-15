import { createApiClient } from './api';

// 관리자 API 클라이언트 생성
const adminApiClient = createApiClient();

// FAQ 재로드
export async function reloadFaqs(): Promise<string> {
  const response = await adminApiClient.post('/faq/reload');
  return response.data;
}

// FAQ 업데이트
export async function updateFaqs(): Promise<string> {
  const response = await adminApiClient.post('/faq/update');
  return response.data;
}

// FAQ 초기화 후 재로드
export async function resetAndReloadFaqs(): Promise<string> {
  const response = await adminApiClient.post('/faq/reset-and-reload');
  return response.data;
}

// FAQ 상태 확인
export async function getFaqStatus(): Promise<string> {
  const response = await adminApiClient.get('/faq/status');
  return response.data;
}

// 모든 관리자 API 함수를 하나의 객체로 묶어서 내보내기
export const adminApi = {
  reloadFaqs,
  updateFaqs,
  resetAndReloadFaqs,
  getFaqStatus,
};
