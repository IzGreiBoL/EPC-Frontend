import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from '../../shared/material/material.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { QuotesService } from '../../core/services/quotes.service';
import { Quote } from '../../core/models/quote.model';
import { GalleryComponent } from "../../shared/components/gallery/gallery.component";

declare const Email: {
  send: (options: {
    SecureToken: string;
    To: string;
    From: string;
    Subject: string;
    Body: string;
  }) => Promise<string>;
};

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MaterialModule, NgbModule, RouterModule, GalleryComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  isSidebarOpen = false; // Estado del sidebar
  isTransparent = false;

  quotes: Quote[] = [];
  galleryItems: { image: string, title: string }[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private quotesService: QuotesService
  ) { }

  ngOnInit(): void {
    this.quotes = this.quotesService.getItems();
    this.quotes.forEach(quote => {
      const image = this.quotesService.getFirstImageFromFolder(quote.folder);
      this.galleryItems.push({ image: image, title: quote.name });
    });
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  sendEmail() {
    const name = (document.getElementById('name') as HTMLInputElement).value;
    const email = (document.getElementById('email') as HTMLInputElement).value;
    const telephone = (document.getElementById('telephone') as HTMLInputElement).value;
    const message = (document.getElementById('message') as HTMLInputElement).value;

    Email.send({
      SecureToken: "YOUR_SECURE_TOKEN", // Genera uno en https://smtpjs.com/
      To: 'jesusgreibol@gmail.com',
      From: email,
      Subject: `Nuevo mensaje de ${name}`,
      Body: `
            Nombre: ${name}<br>
            Correo: ${email}<br>
            Teléfono: ${telephone}<br>
            Mensaje: ${message}
        `
    }).then(() => {
      alert("¡Mensaje enviado correctamente!");
    }).catch((error) => {
      console.error("Error al enviar el correo:", error);
      alert("Hubo un problema al enviar tu mensaje.");
    });
  }
}