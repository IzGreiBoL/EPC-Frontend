import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MailService } from '../../../../core/services/mail.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-quote-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './quote-modal.component.html',
  styleUrls: ['./quote-modal.component.scss']
})
export class QuoteModalComponent {
  @Input() quoteData: any; // Recibe datos de la cotización
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

  onSubmit(): void {
    this.successMsg = '';
    this.errorMsg = '';
    if (this.quoteForm.invalid) return;
    this.loading = true;
    const { name, email, phone, message } = this.quoteForm.value;
    // Combina los datos del cliente y la cotización
    const mailData = {
      to: email,
      subject: 'Nueva solicitud de cotización',
      text: `Nombre: ${name}\nCorreo: ${email}\nTeléfono: ${phone}\nMensaje: ${message}`,
      html: `<b>Nombre:</b> ${name}<br><b>Correo:</b> ${email}<br><b>Teléfono:</b> ${phone}<br><b>Mensaje:</b> ${message}`,
      quote: {
        ...this.quoteData,
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        customerMessage: message
      }
    };
    this.mailService.sendMail(mailData).subscribe({
      next: (response: any) => {
        // Verificar que el response sea exitoso
        if (response && response.ok) {
          this.successMsg = 'Your request has been sent successfully! We will contact you within 24 hours.';
          this.loading = false;
          this.quoteForm.reset();
        } else {
          this.errorMsg = 'Error sending request: ' + (response?.error || 'Unknown error');
          this.loading = false;
        }
      },
      error: () => {
        this.errorMsg = 'Error sending request. Please try again.';
        this.loading = false;
      }
    });
  }
}
