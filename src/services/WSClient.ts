import { LoggerImpl } from "./Logger";

type MessageCallback = (msg: string) => void;

interface WSClient {
  send(message: string): void;
  close(): void;
}

const log = new LoggerImpl("WSClient");

export class WSClientImpl implements WSClient {
  private socket: WebSocket | null = null;
  private readonly url: string;
  private readonly onMessage: MessageCallback;
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;
  private isManuallyClosed = false;

  constructor(url: string, onMessage: MessageCallback) {
    this.url = url;
    this.onMessage = onMessage;
    this.connect();
  }

  private connect() {
    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => {
      log.info("Вебсокет подключен");
      this.reconnectAttempts = 0;
    };

    this.socket.onmessage = (event) => {
      log.debug("Получен ивент", event.data);
      this.onMessage(event.data);
    };

    this.socket.onclose = () => {
      log.warn("Вебсокет отключен");
      if (
        !this.isManuallyClosed &&
        this.reconnectAttempts < this.maxReconnectAttempts
      ) {
        const delay = 1000 * 2 ** this.reconnectAttempts;
        log.info(`Переподключение через ${delay}мс`);
        setTimeout(() => this.connect(), delay);
        this.reconnectAttempts++;
      } else {
        log.error("Максимальное количество переподключений достигнуто");
      }
    };

    this.socket.onerror = (error) => {
      log.error("Ошибка вебсокета", error);
      this.socket?.close();
    };
  }

  send(message: string) {
    this.socket?.send(message);
  }

  close() {
    this.isManuallyClosed = true;
    this.socket?.close();
  }
}
