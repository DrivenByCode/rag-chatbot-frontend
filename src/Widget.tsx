import { Provider } from 'react-redux';
import { ChatWidget } from '@/components/ChatWidget';
import { createChatStore } from '@/store';

const store = createChatStore();
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
const VITE_APP_TITLE = import.meta.env.VITE_APP_TITLE || '';

const Widget: React.FC = () => {
  return (
    <Provider store={store}>
      <div className="app">
        <h1>내 웹사이트</h1>
        <p>콘텐츠가 여기에 들어갑니다...</p>

        <ChatWidget
          apiUrl={API_BASE_URL}
          theme="light"
          position="bottom-right"
          title={VITE_APP_TITLE}
        />
      </div>
    </Provider>
  );
};

export default Widget;
