import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ConfigService } from '../../../core/services/config.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

  constructor(
    private router: Router,
    public config: ConfigService
  ) {

  }

  navigateToContactUs(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/']).then(() => {
      setTimeout(() => {
        this.router.navigate(['/'], { fragment: 'contact' }).then(() => {
          this.scrollToContactUs();
        });
      }, 100); // Pequeño retraso para asegurar que la navegación se complete
    });
  }

  private scrollToContactUs(): void {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

}
