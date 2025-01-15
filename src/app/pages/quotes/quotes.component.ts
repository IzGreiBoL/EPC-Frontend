import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { QuotesService } from '../../core/services/quotes.service';
import { Quote } from '../../core/models/quote.model';
@Component({
  selector: 'app-quotes',
  templateUrl: './quotes.component.html',
  styleUrls: ['./quotes.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class QuotesComponent implements OnInit {
  items: Quote[] = [];

  constructor(private quotesService: QuotesService) {}

  ngOnInit(): void {
    this.items = this.quotesService.getItems();
  }
}