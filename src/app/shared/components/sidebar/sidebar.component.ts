import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  @Input() isOpen: boolean = false;
  isSubmenuOpen: boolean = true;

  toggleSidebar(): void {
    this.isOpen = !this.isOpen;
  }

  toggleSubmenu(event: Event): void {
    event.stopPropagation(); // Detener la propagación del evento de clic
    this.isSubmenuOpen = !this.isSubmenuOpen;
  }
}