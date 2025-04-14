import {ChatWidget} from '@/components/ChatWidget';
import {createChatStore} from '@/store';
import {useChatWidget} from '@/hooks/useChatWidget';
import type {ChatWidgetConfig} from '@/types/chat';

// 외부로 내보내는 API
export {ChatWidget, createChatStore, useChatWidget, type ChatWidgetConfig};
