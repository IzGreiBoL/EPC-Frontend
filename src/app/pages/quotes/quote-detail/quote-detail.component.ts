import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuotesService } from '../../../core/services/quotes.service';
import { Quote } from '../../../core/models/quote.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quote-detail',
  templateUrl: './quote-detail.component.html',
  styleUrls: ['./quote-detail.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class QuoteDetailComponent implements OnInit {
  item: Quote | undefined;
  expandedCategories: boolean[] = [];
  completedOptions: boolean[][][] = [];

  constructor(
    private route: ActivatedRoute,
    private quotesService: QuotesService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      if (idParam !== null) {
        const id = +idParam;
        this.item = this.quotesService.getItemById(id);

        if (this.item) {
          this.expandedCategories = new Array(this.item.categories.length).fill(false);
          this.expandedCategories[0] = true;

          this.completedOptions = this.item.categories.map((category) =>
            category.options.map((option) =>
              typeof option === 'string'
                ? [false]  // Inicializa como un solo booleano para opciones simples
                : option.options.map(() => false)  // Para opciones con subopciones
            )
          ) as boolean[][][];  // Asegura que es de tipo boolean[][][]
        }
      }
    });
  }

  toggleCategory(index: number): void {
    this.expandedCategories[index] = !this.expandedCategories[index]; // Solo cambiar el valor de la categoría en lugar de todas
  }

  completeOption(categoryIndex: number, optionIndex: number, subOptionIndex?: number): void {
    const category = this.item!.categories[categoryIndex];

    if (this.isString(category.options[optionIndex])) {
      // Para categorías con opciones simples (strings)
      this.completedOptions[categoryIndex] = this.completedOptions[categoryIndex].map((_, idx) =>
        idx === optionIndex ? [true] : [false]
      );
    } else {
      // Para opciones con subopciones
      if (subOptionIndex !== undefined) {
        this.completedOptions[categoryIndex][optionIndex] = this.completedOptions[categoryIndex][optionIndex].map(() => false);
        this.completedOptions[categoryIndex][optionIndex][subOptionIndex] = true;
      } else {
        this.completedOptions[categoryIndex][optionIndex] = [true];
      }
    }

    // Verifica si la categoría está completa
    if (this.isCategoryCompleted(categoryIndex)) {
      this.expandedCategories[categoryIndex] = false; // Contraer la categoría actual
      setTimeout(() => this.moveToNextCategory(categoryIndex), 0); // Expandir la siguiente categoría
    }
  }
  
  isCategoryCompleted(categoryIndex: number): boolean {
    const category = this.item!.categories[categoryIndex];

    // Para categorías con opciones simples (strings)
    if (category.options.every((option) => typeof option === 'string')) {
      return this.completedOptions[categoryIndex].some((option) => option[0] === true);
    }

    // Para categorías con subcategorías
    return this.completedOptions[categoryIndex].every((option) =>
      Array.isArray(option) ? option.some((subOption) => subOption === true) : option[0]
    );
  }

  moveToNextCategory(categoryIndex: number): void {
    const nextCategoryIndex = categoryIndex + 1;
    if (nextCategoryIndex < this.expandedCategories.length) {
      this.expandedCategories[nextCategoryIndex] = true; // Solo expandir la siguiente categoría
      this.cdr.detectChanges(); // Forzar la detección de cambios
    }
  }

  isOptionCompleted(categoryIndex: number, optionIndex: number): boolean {
    const option = this.completedOptions[categoryIndex][optionIndex];
    return Array.isArray(option) ? option.every((subOption) => subOption === true) : option[0];
  }

  isSubOptionCompleted(categoryIndex: number, optionIndex: number, subOptionIndex: number): boolean {
    return this.completedOptions[categoryIndex][optionIndex][subOptionIndex] === true;
  }

  isString(option: string | { name: string; options: string[] }): option is string {
    return typeof option === 'string';
  }
}