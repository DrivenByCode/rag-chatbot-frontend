import {useDispatch} from 'react-redux';
import type {AppDispatch} from '@/store';

// 타입이 지정된 디스패치 훅 사용
export const useAppDispatch = () => useDispatch<AppDispatch>();
