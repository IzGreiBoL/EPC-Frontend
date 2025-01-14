import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {

  @Input() isOpen: boolean = false;

  toggleSidebar(): void {
    this.isOpen = !this.isOpen;
  }
}