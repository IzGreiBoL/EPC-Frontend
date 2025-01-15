import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuotesService } from '../../../core/services/quotes.service';
import { Quote } from '../../../core/models/quote.model';

@Component({
  selector: 'app-quote-detail',
  templateUrl: './quote-detail.component.html',
  styleUrls: ['./quote-detail.component.scss'],
  standalone: true,
  imports: []
})
export class QuoteDetailComponent implements OnInit {
  item: Quote | undefined;

  constructor(private route: ActivatedRoute, private quotesService: QuotesService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam !== null) {
        const id = +idParam;
        this.item = this.quotesService.getItemById(id);
        console.log(this.item);
      }
    });
  }
}