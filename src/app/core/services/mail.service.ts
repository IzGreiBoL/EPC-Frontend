import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ConfigService } from './config.service';
import { Observable, catchError, map } from 'rxjs';

interface MailData {
  to: string;
  subject: string;
  text?: string;
  html?: string;
  quote?: Record<string, unknown>;
}

interface MailResponse {
  ok: boolean;
  results?: Record<string, unknown>;
  error?: string;
  note?: string;
  template_info?: Record<string, unknown>;
}

@Injectable({ providedIn: 'root' })
export class MailService {
  constructor(
    private http: HttpClient,
    private config: ConfigService
  ) {}

  private get apiUrl(): string {
    return this.config.mailApiUrl;
  }

  sendMail(data: MailData): Observable<MailResponse> {
    
    return this.http.post<MailResponse>(this.apiUrl, data).pipe(
      map((response: MailResponse) => {
        
        // Verificar si la respuesta es exitosa
        if (response && response.ok === true) {
          return response;
        } else {
          throw new Error(response?.error || 'Email sending failed');
        }
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('❌ HTTP Error in mail service:', error);
        console.error('❌ Error status:', error.status);
        console.error('❌ Error message:', error.message);
        console.error('❌ Error body:', error.error);
        
        // Re-throw para que el componente pueda manejarlo
        throw error;
      })
    );
  }
}