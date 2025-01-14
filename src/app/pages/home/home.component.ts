import { Component } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { MaterialModule } from '../../shared/material/material.module';

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
  imports: [MaterialModule, NgbModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  isSidebarOpen = false; // Estado del sidebar
  isTransparent = false;

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