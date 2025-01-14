import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgClass, SidebarComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Input() isTransparent: boolean = false;
}
