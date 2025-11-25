import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MailService } from '../../../../core/services/mail.service';
import { QuoteData } from '../../../../shared/services/pdf-generator.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

interface MailResponse {
  ok: boolean;
  message?: string;
  quote_number?: string;
  error?: string;
  pdf_received?: boolean;
  pdf_attached?: boolean;
}


interface QuoteModalData extends QuoteData {
  formattedSelections?: { category: string; subcategories: string[] }[];
  [key: string]: unknown;
}

@Component({
  selector: 'app-quote-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './quote-modal.component.html',
  styleUrls: ['./quote-modal.component.scss']
})
export class QuoteModalComponent {
  @Input() quoteData?: QuoteModalData; // Recibe datos de la cotización
  quoteForm: FormGroup;
  loading = false;
  successMsg = '';
  errorMsg = '';

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private mailService: MailService
  ) {
    this.quoteForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      message: ['']
    });
  }

  closeModal(): void {
    this.activeModal.close();
  }

  private generateQuoteNumber(email: string): string {
    // Genera un hash corto basado en email para consistencia
    const emailHash = email.split('').reduce((hash, char) => {
      return ((hash << 5) - hash) + char.charCodeAt(0);
    }, 0);
    const shortHash = Math.abs(emailHash).toString().substring(0, 4);
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const quoteNumber = `Q${today}-${shortHash}`;
    
    return quoteNumber;
  }

  onSubmit(): void {
    this.successMsg = '';
    this.errorMsg = '';
    if (this.quoteForm.invalid) return;
    this.loading = true;
    
    const { name, email, phone, message } = this.quoteForm.value;
    const quoteNumber = this.generateQuoteNumber(email);
    
    const quoteDataForPDF: QuoteData = {
      quoteNo: quoteNumber,
      date: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }),
      clientName: name,
      customerEmail: email,
      customerPhone: phone || '',
      customerMessage: message || '',
      modelOfHouse: (this.quoteData?.modelOfHouse as string) || 'Custom Home',
      pricePerSqft: (this.quoteData?.pricePerSqft as number) || 0,
      sqftTotal: (this.quoteData?.sqftTotal as number) || 0,
      total: (this.quoteData?.total as number) || 0,
      stampImageUrl: (this.quoteData?.stampImageUrl as string) || '',
      modelSelectionsRows: this.formatSelections(),
      formattedSelections: this.quoteData?.formattedSelections || []
    };

    this.mailService.sendQuoteWithPDF(quoteDataForPDF).then((response: MailResponse) => {
      if (response && response.ok) {
        const successMessage = `Your request has been sent successfully! Quote #${response.quote_number} - We will contact you within 24 hours.`;
          
        this.successMsg = successMessage;
        this.loading = false;
        this.quoteForm.reset();
      } else {
        this.errorMsg = 'Error sending request: ' + (response?.error || 'Unknown error');
        this.loading = false;
      }
    }).catch(() => {
      this.errorMsg = 'Error sending request. Please try again.';
      this.loading = false;
    });
  }

  private formatSelections(): string {
    if (!this.quoteData?.formattedSelections || this.quoteData.formattedSelections.length === 0) {
      return '<div style="padding:8px 0;">No specific selections made</div>';
    }

    let html = '';
    this.quoteData.formattedSelections.forEach((selection: { category: string; subcategories: string[] }) => {
      const finalSelections = selection.subcategories.map(subcategory => {
        const parts = subcategory.split(':');
        return parts[parts.length - 1].trim();
      });

      html += `<div style="padding:8px 0;border-bottom:1px solid #e0e0e0;">`;
      html += `<strong>${selection.category}:</strong> ${finalSelections.join(', ')}`;
      html += `</div>`;
    });

    return html;
  }
}
