import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  getFaqStatus,
  reloadFaqs,
  resetAndReloadFaqs,
  updateFaqs,
} from '@/api/admin';

const AdminPage: React.FC = () => {
  const [statusMessage, setStatusMessage] = useState<string>('');

  const handleReload = async () => {
    try {
      const res = await reloadFaqs();
      setStatusMessage(`FAQ 재로드 성공: ${res}`);
    } catch (error) {
      setStatusMessage('FAQ 재로드 실패');
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await updateFaqs();
      setStatusMessage(`FAQ 업데이트 성공: ${res}`);
    } catch (error) {
      setStatusMessage('FAQ 업데이트 실패');
    }
  };

  const handleResetAndReload = async () => {
    try {
      const res = await resetAndReloadFaqs();
      setStatusMessage(`FAQ 초기화 및 재로드 성공: ${res}`);
    } catch (error) {
      setStatusMessage('FAQ 초기화 및 재로드 실패');
    }
  };

  const handleCheckStatus = async () => {
    try {
      const res = await getFaqStatus();
      setStatusMessage(`FAQ 상태: ${res}`);
    } catch (error) {
      setStatusMessage('FAQ 상태 확인 실패');
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-4 text-center text-blue-600">
        관리자 페이지
      </h1>
      <div className="flex flex-col items-center space-y-4">
        <Button onClick={handleReload}>FAQ 재로드</Button>
        <Button onClick={handleUpdate}>FAQ 업데이트</Button>
        <Button onClick={handleResetAndReload}>FAQ 초기화 및 재로드</Button>
        <Button onClick={handleCheckStatus}>FAQ 상태 확인</Button>
      </div>
      {statusMessage && (
        <div className="mt-6 p-4 bg-white rounded shadow text-center">
          {statusMessage}
        </div>
      )}
    </div>
  );
};

export default AdminPage;
