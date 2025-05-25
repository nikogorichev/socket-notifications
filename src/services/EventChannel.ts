import { Subject, Observable } from "rxjs";

export interface NotificationMessage {
  id: number;
  message: string;
  timestamp: string;
}

export class EventChannel {
  private subject = new Subject<NotificationMessage>();

  publish(raw: string) {
    try {
      const parsed: NotificationMessage = JSON.parse(raw);
      this.subject.next(parsed);
    } catch (error) {
      console.error("Error", raw, error);
    }
  }

  getStream(): Observable<NotificationMessage> {
    return this.subject.asObservable();
  }
}
