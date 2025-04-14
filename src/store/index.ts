import { configureStore } from '@reduxjs/toolkit';
import chatReducer from '@/store/slices/chatSlice';

export const createChatStore = () => {
  return configureStore({
    reducer: {
      chat: chatReducer,
    },
  });
};

export type RootState = ReturnType<
  ReturnType<typeof createChatStore>['getState']
>;
export type AppDispatch = ReturnType<typeof createChatStore>['dispatch'];
