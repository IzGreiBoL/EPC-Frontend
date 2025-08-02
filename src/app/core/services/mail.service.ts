import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';

@Injectable({ providedIn: 'root' })
export class MailService {
  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) {}

  private get apiUrl(): string {
    return this.config.mailApiUrl;
  }

  sendMail(data: { to: string; subject: string; text?: string; html?: string }) {
    return this.http.post(this.apiUrl, data);
  }
}