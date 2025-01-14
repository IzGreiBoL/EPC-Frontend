import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-home-layout',
  standalone: true,
  imports: [RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './home-layout.component.html',
  styleUrl: './home-layout.component.scss'
})
export class HomeLayoutComponent {
  isSidebarOpen = false; // Estado del sidebar
  isHomePage = false; // Estado para determinar si es la página de inicio

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isHomePage = this.router.url === '/';
      }
    });
  }

  onActivate(): void {
    if (typeof window !== 'undefined') {
      window.scroll(0, 0);
    }
  }
}