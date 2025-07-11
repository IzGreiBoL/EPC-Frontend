import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuotesService } from '../../../core/services/quotes.service';
import { Quote, SubCategory } from '../../../core/models/quote.model';
import { NgFor, CurrencyPipe, CommonModule } from '@angular/common';
import { GalleryComponent } from '../../../shared/components/gallery/gallery.component';
import { LucideAngularModule, Mail } from 'lucide-angular';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { QuoteModalComponent } from './quote-modal/quote-modal.component';

@Component({
  selector: 'app-quote-detail',
  templateUrl: './quote-detail.component.html',
  styleUrls: ['./quote-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, NgFor, CurrencyPipe, LucideAngularModule, GalleryComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class QuoteDetailComponent implements OnInit {
  item: Quote | undefined;
  galleryItems: { image: string; title: number }[] = [];
  currentCategoryIndex = 0;
  userSelections: Record<string, string> = {};
  estimatedTotal: number | string = 0;
  basePrice = 0;
  showBreakdown = false;
  formattedSelections: { category: string; subcategories: string[] }[] = [];
  breakdownItems: { name: string; price: number | string }[] = [];
  mailIcon = Mail;
  quoteType: 'basic' | 'advanced' = 'basic';
  gallerySize: 'small' | 'large' = 'large'; // Propiedad para el tamaño de la galería
  pricePerSqFtNum: number = 0;
  numericTotal = 0;          // siempre number
  hasCustomOption = false;

  constructor(private route: ActivatedRoute,
    private modalService: NgbModal,
    public quotesService: QuotesService) {
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = +params.get('id')!;
      const type = this.route.snapshot.paramMap.get('type') as 'basic' | 'advanced';
      this.quoteType = type || 'basic';
      this.item = this.quotesService.getItemById(id);
      if (this.item) {
        // Si el modelo tiene basePrice, úsalo; si no, usa un valor por defecto
        this.basePrice = (this.item as any).basePrice;
        const images = this.quotesService.getImagesFromFolder(this.item.folder);
        this.galleryItems = images.map((image) => ({ image, title: this.item?.size ?? 0 }));

        const categories = this.quotesService.getCategoriesByType(this.quoteType);
        this.item.categories = categories;

        this.item.categories.forEach((category, index) => {
          if (this.quoteType === 'basic') {
            // Preseleccionar solo la primera opción en la versión básica
            if (category.options.length > 0) {
              const option = category.options[0];
              this.userSelections[`${index}_0`] = `${category.name}: ${option.name}`;
            }
          } else {
            // Preseleccionar la primera opción de todas las subcategorías en la versión avanzada
            category.options.forEach((option, subIndex) => {
              if (this.isSubcategory(option)) {
                this.userSelections[`${index}_${subIndex}`] = `${option.name}: ${option.options[0]?.name ?? ''}`;
              } else {
                this.userSelections[`${index}_${subIndex}`] = `${category.name}: ${option.name}`;
              }
            });
          }
        });

        this.updateFormattedSelections();
        this.calculateTotal();
      }
    });

    this.updateGallerySize();
  }

  // Detectar cambios en el tamaño de la ventana
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.updateGallerySize();
  }

  // Actualizar el tamaño de la galería según el ancho de la ventana
  private updateGallerySize(): void {
    const windowWidth = window.innerWidth;
    this.gallerySize = windowWidth < 768 ? 'small' : 'large'; // Cambiar entre 'small' y 'medium'
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

      // Lógica para la versión básica
      if (this.quoteType === 'basic') {
        // Limpiar todas las selecciones previas de la categoría actual
        Object.keys(this.userSelections).forEach((key) => {
          if (key.startsWith(`${this.currentCategoryIndex}_`)) {
            delete this.userSelections[key];
          }
        });

        // Agregar la nueva selección
        const selection = `${category.name}: ${option.name}`;
        this.userSelections[`${this.currentCategoryIndex}_${subIndex}`] = selection;
      }

      // Lógica para la versión avanzada
      else if (this.quoteType === 'advanced') {
        // Limpiar selecciones previas solo para la subcategoría actual
        Object.keys(this.userSelections).forEach((key) => {
          if (key === `${this.currentCategoryIndex}_${subIndex}`) {
            delete this.userSelections[key];
          }
        });

        if (this.isSubcategory(option)) {
          const selectedSubOption = option.options[optionIndex];
          if (selectedSubOption) {
            const selection = `${option.name}: ${selectedSubOption.name}`;
            this.userSelections[`${this.currentCategoryIndex}_${subIndex}`] = selection;
          }
        } else {
          const selection = `${category.name}: ${option.name}`;
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
    const countedCategories = new Set<number>(); // ⬅︎ ids ya procesados
    let extraPerSqFt = 0;
    let hasCustomOption = false;

    Object.values(this.userSelections).forEach(selection => {
      const selectedOptionName = selection.split(': ')[1];

      // localizar categoría y opción
      const category = this.item?.categories.find(cat =>
        cat.options.some(opt =>
          this.isSubcategory(opt)
            ? opt.options.some(sub => sub.name === selectedOptionName)
            : opt.name === selectedOptionName
        )
      );
      if (!category) return;

      const option = category.options
        .flatMap(opt => this.isSubcategory(opt) ? opt.options : [opt])
        .find(opt => opt.name === selectedOptionName);
      if (!option) return;

      // sumar basePrice solo la primera vez por categoría
      if (!countedCategories.has(category.id)) {
        extraPerSqFt += category.basePrice ?? 0;
        countedCategories.add(category.id);
        console.log(category.name, 'basePrice:', category.basePrice);
      }

      // sumar sobreprecio (si es numérico)
      if (typeof option.price === 'number') {
        extraPerSqFt += option.price;
      } else if (option.price === '+c') {
        hasCustomOption = true;
      }
    });

    // 4️⃣ precio POR ft² (modelo base + extras)
    const pricePerSqFt = this.basePrice + extraPerSqFt;

    // 5️⃣ total global
    const size = (this.item as any)?.size ?? 0;
    const numericTotal = pricePerSqFt * size;

    // Guarda valores para la vista
    this.numericTotal = numericTotal;        // <-- número puro
    this.hasCustomOption = hasCustomOption;

    this.estimatedTotal = hasCustomOption
      ? `${numericTotal.toFixed(2)} + c`
      : numericTotal.toFixed(2);

    // 6️⃣ guardar $/ft²
    this.pricePerSqFtNum = pricePerSqFt; 
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
        const selection = `${category.name}: ${option.name}`;
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
    this.modalService.open(QuoteModalComponent, { centered: true });
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
        cat.options.some(opt => this.isSubcategory(opt) ? opt.options.some(subOpt => subOpt.name === selectedOption) : opt.name === selectedOption)
      );

      const option = category?.options.flatMap(opt => this.isSubcategory(opt) ? opt.options : [opt]).find(opt => opt.name === selectedOption);
      return { name: selection, price: option?.price ?? 0 };
    });
  }

  getIconByCategory(categoryName: string): any {
    const category = this.item?.categories.find(cat => cat.name === categoryName);
    return category ? this.quotesService.getIconByCategory(category) : null;
  }

}