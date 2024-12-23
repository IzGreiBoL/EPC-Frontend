import { Component } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { MaterialModule } from '../../shared/material/material.module';
import { SidebarComponent } from "../../shared/components/sidebar/sidebar.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MaterialModule, NgbModule, SidebarComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  isSidebarOpen = false; // Estado del sidebar

  toggleSidebar(): void {
      this.isSidebarOpen = !this.isSidebarOpen;
  }

}
