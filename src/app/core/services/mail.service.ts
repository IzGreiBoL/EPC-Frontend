import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class MailService {
  private apiUrl = 'http://localhost:3001/send-email';

  constructor(private http: HttpClient) {}

  sendMail(data: { to: string; subject: string; text?: string; html?: string }) {
    return this.http.post(this.apiUrl, data);
  }
}