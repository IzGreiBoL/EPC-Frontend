import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ConfigService } from './config.service';
import { Observable, catchError, map, firstValueFrom } from 'rxjs';
import { PdfGeneratorService, QuoteData } from '../../shared/services/pdf-generator.service';
import { environment } from '../../../environments/environment';

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
  quote_number?: string;
  message?: string;
  pdf_received?: boolean;
  pdf_attached?: boolean;
}

interface Selection {
  category: string;
  subcategories: string[];
}

@Injectable({ providedIn: 'root' })
export class MailService {
  constructor(
    private http: HttpClient,
    private config: ConfigService,
    private pdfGenerator: PdfGeneratorService
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
        // Re-throw para que el componente pueda manejarlo
        throw error;
      })
    );
  }

  /**
   * Envía cotización con PDF generado en Angular
   */
  async sendQuoteWithPDF(quoteData: QuoteData): Promise<MailResponse> {
    try {
      // 1. Generar PDF
      const pdfBlob = await this.pdfGenerator.generateQuotePDF(quoteData);
      const pdfBase64 = await this.blobToBase64(pdfBlob);
      
      // 2. Preparar datos para envío
      const emailData = {
        quoteNumber: quoteData.quoteNo, // Enviamos el número generado en Angular
        customerName: quoteData.clientName,
        customerEmail: quoteData.customerEmail,
        customerPhone: quoteData.customerPhone || '',
        customerMessage: quoteData.customerMessage || '',
        modelOfHouse: quoteData.modelOfHouse,
        pricePerSqft: quoteData.pricePerSqft,
        sqftTotal: quoteData.sqftTotal,
        total: quoteData.total,
        stampImageUrl: quoteData.stampImageUrl || '',
        modelSelectionsRows: quoteData.modelSelectionsRows,
        selections: this.formatSelectionsForEmail(quoteData.formattedSelections || []),
        pdfBase64: pdfBase64
      };
      
      // 3. Enviar al servidor PHP
      const response = await firstValueFrom(
        this.http.post<MailResponse>(environment.api.baseUrl + environment.api.endpoints.sendEmailWithPdf, emailData)
      );
      
      return response;
      
    } catch (error) {
      console.error('Error in sendQuoteWithPDF:', error);
      // Fallback: enviar sin PDF
      return this.sendQuoteWithoutPDF(quoteData);
    }
  }

  /**
   * Envía cotización sin PDF (fallback)
   */
  async sendQuoteWithoutPDF(quoteData: QuoteData): Promise<MailResponse> {
    const emailData = {
      quoteNumber: quoteData.quoteNo, // Enviamos el número generado en Angular
      customerName: quoteData.clientName,
      customerEmail: quoteData.customerEmail,
      customerPhone: quoteData.customerPhone || '',
      customerMessage: quoteData.customerMessage || '',
      modelOfHouse: quoteData.modelOfHouse,
      pricePerSqft: quoteData.pricePerSqft,
      sqftTotal: quoteData.sqftTotal,
      total: quoteData.total,
      stampImageUrl: quoteData.stampImageUrl || '',
      modelSelectionsRows: quoteData.modelSelectionsRows
    };

    return firstValueFrom(
      this.http.post<MailResponse>(environment.api.baseUrl + environment.api.endpoints.sendEmail, emailData)
    );
  }

  /**
   * Convierte Blob a Base64
   */
  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remover el prefijo "data:application/pdf;base64," si existe
        const base64 = result.includes(',') ? result.split(',')[1] : result;
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  /**
   * Convierte array de selecciones a HTML para el PDF
   */
  private parseSelections(selections: Selection[]): string {
    if (!selections || selections.length === 0) {
      return '<div style="padding:8px 0;">No specific selections made</div>';
    }

    let html = '';
    selections.forEach(selection => {
      html += `<div style="padding:8px 0;border-bottom:1px solid #e0e0e0;">`;
      html += `<strong>${selection.category}:</strong> ${selection.subcategories.join(', ')}`;
      html += `</div>`;
    });

    return html;
  }

  /**
   * Convierte HTML de selecciones a texto plano para email de empresa
   */
  private formatSelectionsForEmail(htmlSelections: string): string;
  private formatSelectionsForEmail(formattedSelections: { category: string; subcategories: string[] }[]): string;
  private formatSelectionsForEmail(input: string | { category: string; subcategories: string[] }[]): string {
    if (Array.isArray(input)) {
      return this.formatSelectionsFromArray(input);
    } else {
      return this.formatSelectionsFromHTML(input);
    }
  }

  /**
   * Formatea selecciones desde el arreglo de selecciones (formato preferido)
   */
  private formatSelectionsFromArray(formattedSelections: { category: string; subcategories: string[] }[]): string {
    if (!formattedSelections || formattedSelections.length === 0) {
      return 'No hay selecciones específicas';
    }

    const formattedLines = formattedSelections.map(selection => {
      const finalSelections = selection.subcategories.map(subcategory => {
        const parts = subcategory.split(':');
        return parts[parts.length - 1].trim();
      });

      return `${selection.category}: ${finalSelections.join(', ')}`;
    });

    return formattedLines.join('\n');
  }

  /**
   * Formatea selecciones desde HTML (para compatibilidad)
   */
  private formatSelectionsFromHTML(htmlSelections: string): string {
    if (!htmlSelections || htmlSelections === '<div style="padding:8px 0;">No specific selections made</div>') {
      return 'No hay selecciones específicas';
    }

    // Convertir HTML a texto plano, removiendo todos los tags HTML
    const textSelections = htmlSelections
      .replace(/<[^>]*>/g, '') // Remover todos los tags HTML
      .replace(/&nbsp;/g, ' ') // Convertir &nbsp; a espacios
      .replace(/&amp;/g, '&') // Convertir &amp; a &
      .replace(/&lt;/g, '<') // Convertir &lt; a <
      .replace(/&gt;/g, '>') // Convertir &gt; a >
      .replace(/&quot;/g, '"') // Convertir &quot; a "
      .trim();

    const lines = textSelections.split('\n').filter(line => line.trim().length > 0);
    const processedLines = lines.map(line => {
      const trimmedLine = line.trim();
      
      const colonCount = (trimmedLine.match(/:/g) || []).length;
      
      if (colonCount >= 2) {
        const parts = trimmedLine.split(':');
        if (parts.length >= 3) {
          const category = parts[0].trim();
          const finalSelection = parts[parts.length - 1].trim();
          return `${category}: ${finalSelection}`;
        }
      }
      
      return trimmedLine;
    });

    return processedLines.join('\n');
  }
}