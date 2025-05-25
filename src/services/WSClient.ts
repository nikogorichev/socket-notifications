type MessageCallback = (msg: string) => void;

export class WSClient {
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
      console.log("WebSocket connected");
      this.reconnectAttempts = 0;
    };

    this.socket.onmessage = (event) => {
      this.onMessage(event.data);
    };

    this.socket.onclose = () => {
      console.warn("WebSocket closed");
      if (
        !this.isManuallyClosed &&
        this.reconnectAttempts < this.maxReconnectAttempts
      ) {
        const delay = 1000 * 2 ** this.reconnectAttempts;
        console.log(`Reconnecting in ${delay}ms...`);
        setTimeout(() => this.connect(), delay);
        this.reconnectAttempts++;
      } else {
        console.error("Max reconnect attempts reached");
      }
    };

    this.socket.onerror = () => {
      this.socket?.close();
    };
  }

  public send(message: string) {
    this.socket?.send(message);
  }

  public close() {
    this.isManuallyClosed = true;
    this.socket?.close();
  }
}
