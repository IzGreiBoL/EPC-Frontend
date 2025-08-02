import { AfterViewInit, Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from '../../shared/material/material.module';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { QuotesService } from '../../core/services/quotes.service';
import { Quote } from '../../core/models/quote.model';
import { GalleryComponent } from "../../shared/components/gallery/gallery.component";
import { ConfigService } from '../../core/services/config.service';

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
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild('projects') projectsSection!: ElementRef;
  @ViewChild('contact') contactUsSection!: ElementRef;

  isSidebarOpen = false; // Estado del sidebar
  isTransparent = false;

  quotes: Quote[] = [];
  galleryItems: { image: string, title: string }[] = [];

  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    private route: ActivatedRoute,
    private quotesService: QuotesService,
    public config: ConfigService
  ) { }

  ngOnInit(): void {
    this.quotes = this.quotesService.getItems();
    this.quotes.forEach(quote => {
      const image = this.quotesService.getFirstImageFromFolder(quote.folder);
      this.galleryItems.push({ image: image, title: quote.name });
    });
  }

  ngAfterViewInit() {
    this.route.fragment.subscribe(fragment => {
      if (fragment === 'projects') {
        this.scrollToProjects();
      }
      if (fragment === 'contact') {
        this.scrollToContactUs();
      }
    });
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  scrollToProjects() {
    if (this.projectsSection) {
      this.projectsSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
  }

  scrollToContactUs() {
    if (this.contactUsSection) {
      this.contactUsSection.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
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