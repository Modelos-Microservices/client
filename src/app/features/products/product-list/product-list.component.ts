import { Component, inject } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { CommonModule } from '@angular/common';
import { CategoriesService } from '../../../core/services/categories.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {

  private readonly productsSvc = inject(ProductService);
  products$ = this.productsSvc.getAllProducts();
  private readonly categoriesSvc = inject(CategoriesService);
  categories$ = this.categoriesSvc.getAllCategories();
  
}
