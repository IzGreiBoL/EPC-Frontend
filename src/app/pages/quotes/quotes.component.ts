import { NgFor } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-quotes',
  standalone: true,
  imports: [NgFor],
  templateUrl: './quotes.component.html',
  styleUrl: './quotes.component.scss'
})
export class QuotesComponent {

  items = [
    { image: 'images/house.jpg', text: '7400 FT SQ' },
    { image: 'images/house1.jpg', text: '3200 FT SQ' },
    { image: 'images/house2.jpg', text: '7800 FT SQ' },
    { image: 'images/house3.jpg', text: '2230 FT SQ' },
    { image: 'images/house4.jpeg', text: '4444 FT SQ' },
  ];

}
