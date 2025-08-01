import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

  constructor(
    private router: Router
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
