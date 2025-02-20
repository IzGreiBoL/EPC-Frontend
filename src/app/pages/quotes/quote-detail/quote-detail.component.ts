import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuotesService } from '../../../core/services/quotes.service';
import { Quote, SubCategory } from '../../../core/models/quote.model';
import { NgFor, CurrencyPipe, CommonModule } from '@angular/common';
import { GalleryComponent } from '../../../shared/components/gallery/gallery.component';
import { LucideAngularModule, Mail } from 'lucide-angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

@Component({
  selector: 'app-quote-detail',
  templateUrl: './quote-detail.component.html',
  styleUrls: ['./quote-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, NgFor, CurrencyPipe, GalleryComponent, LucideAngularModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class QuoteDetailComponent implements OnInit {
  item: Quote | undefined;
  galleryItems: { image: string; title: string }[] = [];
  currentCategoryIndex = 0;
  userSelections: Record<string, string> = {};
  estimatedTotal = 415000;
  basePrice = 400000;
  showBreakdown = false;
  formattedSelections: { category: string; subcategories: string[] }[] = [];
  breakdownItems: { name: string; price: number }[] = [];
  mailIcon = Mail;

  constructor(private route: ActivatedRoute, public quotesService: QuotesService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = +params.get('id')!;
      this.item = this.quotesService.getItemById(id);
      if (this.item) {
        const images = this.quotesService.getImagesFromFolder(this.item.folder);
        this.galleryItems = images.map((image) => ({ image, title: this.item?.text ?? '' }));

        this.item.categories.forEach((category, index) => {
          if (category.options) {
            category.options.forEach((option, subIndex) => {
              if (this.isSubcategory(option)) {
                this.userSelections[`${index}_${subIndex}`] = `${option.name}: ${option.options[0]?.name ?? ''}`;
              } else {
                this.userSelections[`${index}_${subIndex}`] = `${category.name}: ${option}`;
              }
            });
          }
        });

        this.updateFormattedSelections();
        this.calculateTotal();
      }
    });
  }

  get currentCategory() {
    return this.item?.categories[this.currentCategoryIndex];
  }

  get totalSteps() {
    return this.item?.categories.length ?? 0;
  }

  get progress() {
    return ((this.currentCategoryIndex + 1) / (this.totalSteps || 1)) * 100;
  }

  selectOption(subIndex: number, optionIndex: number): void {
    const category = this.currentCategory;

    if (category?.options) {
      const option = category.options[subIndex];
      if (this.isSubcategory(option)) {
        const selectedSubOption = option.options[optionIndex];
        if (selectedSubOption) {
          const selection = `${option.name}: ${selectedSubOption.name}`;
          this.userSelections[`${this.currentCategoryIndex}_${subIndex}`] = selection;
        }
      }
      this.updateFormattedSelections();
      this.calculateTotal();
    }
  }

  updateFormattedSelections(): void {
    const groupedSelections: { category: string; subcategories: string[] }[] = [];
  
    Object.entries(this.userSelections).forEach(([key, value]) => {
      const [catIndex] = key.split('_');
      const category = this.item?.categories[+catIndex];
      if (category) {
        let existing = groupedSelections.find(g => g.category === category.name);
        if (!existing) {
          existing = { category: category.name, subcategories: [] };
          groupedSelections.push(existing);
        }
        existing.subcategories.push(value);
      }
    });
  
    this.formattedSelections = groupedSelections;
  }
  

  calculateTotal(): void {
    this.estimatedTotal = this.basePrice + Object.values(this.userSelections).reduce((total, selection) => {
      const selectedOption = selection.split(': ')[1];
      const category = this.item?.categories.find(cat =>
        cat.options.some(sub => sub.options.some(opt => opt.name === selectedOption))
      );

      const price = category?.options.flatMap(sub => sub.options).find(opt => opt.name === selectedOption)?.price ?? 0;
      return total + price;
    }, 0);
  }

  isSelected(subIndex: number, optionIndex: number): boolean {
    const category = this.currentCategory;
    if (category?.options) {
      const option = category.options[subIndex];
      if (this.isSubcategory(option)) {
        const selectedOptionName = option.options[optionIndex]?.name;
        const selection = `${option.name}: ${selectedOptionName}`;
        return Object.values(this.userSelections).includes(selection);
      } else {
        const selection = `${category.name}: ${option}`;
        return Object.values(this.userSelections).includes(selection);
      }
    }
    return false;
  }

  isSubcategory(item: unknown): item is SubCategory {
    return typeof item === 'object' && item !== null && 'name' in item && 'options' in item;
  }

  previousCategory(): void {
    if (this.hasPrevious()) {
      this.currentCategoryIndex--;
      this.updateFormattedSelections();
    }
  }

  nextCategory(): void {
    if (this.hasNext()) {
      this.currentCategoryIndex++;
      this.updateFormattedSelections();
    }
  }

  hasPrevious(): boolean {
    return this.currentCategoryIndex > 0;
  }

  hasNext(): boolean {
    return this.currentCategoryIndex < (this.totalSteps - 1);
  }

  requestQuote(): void {
    alert('Quote request sent!');
  }

  toggleBreakdown(): void {
    this.showBreakdown = !this.showBreakdown;
    if (this.showBreakdown) {
      this.updateBreakdown();
    }
  }

  updateBreakdown(): void {
    this.breakdownItems = Object.values(this.userSelections).map(selection => {
      const selectedOption = selection.split(': ')[1];
      const category = this.item?.categories.find(cat =>
        cat.options.some(sub => sub.options.some(opt => opt.name === selectedOption))
      );

      const option = category?.options.flatMap(sub => sub.options).find(opt => opt.name === selectedOption);
      return { name: selection, price: option?.price ?? 0 };
    });
  }

  getIconByCategory(categoryName: string): any {
    const category = this.item?.categories.find(cat => cat.name === categoryName);
    return category ? this.quotesService.getIconByCategory(category) : null;
  }
  
}
