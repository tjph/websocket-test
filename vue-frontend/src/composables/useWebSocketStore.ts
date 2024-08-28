import { reactive, readonly } from 'vue';

export interface Message {
  store: string;
  model: string;
  inventory: number;
}

const state = reactive({
  messages: [] as Message[],
});

export function useWebSocketStore() {
  const ws = new WebSocket('ws://localhost:8080');

  ws.onmessage = (event: MessageEvent) => {
    try {
      const message: Message = JSON.parse(event.data);

      const existingMessage = state.messages.find(
        (msg) => msg.store === message.store && msg.model === message.model
      );

      if (existingMessage) {
        existingMessage.inventory = message.inventory;
      } else {
        state.messages.push(message);
      }
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  };

  const closeWebSocket = () => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.close();
    }
  };

  return {
    messages: readonly(state.messages),
    closeWebSocket,
  };
}
