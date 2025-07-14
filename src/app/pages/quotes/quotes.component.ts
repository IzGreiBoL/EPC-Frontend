import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { QuotesService } from '../../core/services/quotes.service';
import { Quote } from '../../core/models/quote.model';
import { LucideAngularModule, Bed, Bath } from 'lucide-angular';

@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule]
})
export class QuotesComponent implements OnInit {
  items: Quote[] = [];
  bedroomsIcon = Bed;
  bathroomsIcon = Bath;

  constructor(private quotesService: QuotesService) {}

  ngOnInit(): void {
    this.items = this.quotesService.getItems();
  }

  getFirstImage(folder: string): string {
    return `images/${folder}/image1.jpg`;
  }
}