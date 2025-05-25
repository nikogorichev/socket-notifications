import { Subject, Observable } from "rxjs";
import { LoggerImpl } from "./Logger";

const log = new LoggerImpl("EventChannel");

export interface NotificationMessage {
  id: number;
  message: string;
  timestamp: string;
}

interface EventChannel {
  publish(raw: string): void;
  getStream(): Observable<NotificationMessage>;
}

export class EventChannelImpl implements EventChannel {
  private subject = new Subject<NotificationMessage>();

  publish(raw: string) {
    try {
      const parsed: NotificationMessage = JSON.parse(raw);
      log.debug("Публикуем сообщение в поток", parsed);
      this.subject.next(parsed);
    } catch (error) {
      log.error("Ошибка парсинга сообщения", { raw, error });
    }
  }

  getStream(): Observable<NotificationMessage> {
    return this.subject.asObservable();
  }
}
