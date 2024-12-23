import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from "../../shared/components/sidebar/sidebar.component";

@Component({
  selector: 'app-home-layout',
  standalone: true,
  imports: [RouterModule, SidebarComponent],
  templateUrl: './home-layout.component.html',
  styleUrl: './home-layout.component.scss'
})
export class HomeLayoutComponent {

  isSidebarOpen = false; // Estado del sidebar

  toggleSidebar(): void {
      this.isSidebarOpen = !this.isSidebarOpen;
  }
}
