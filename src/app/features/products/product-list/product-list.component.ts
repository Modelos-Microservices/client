import { Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../../../core/services/product.service';
import { CommonModule } from '@angular/common';
import { CategoriesService } from '../../../core/services/categories.service';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CartService } from '../../../core/services/cart.service';
import { UserKeyCloakService } from '../../../core/services/user-key-cloak.service';
import { CreateOrderItemDto } from '../../../core/entities/order.entitie';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, FormsModule, ToastModule, ButtonModule, RouterModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
  providers: [MessageService]
})
export class ProductListComponent implements OnInit {

  private readonly productsSvc = inject(ProductService);
  products$ = this.productsSvc.getAllProducts();
  private readonly categoriesSvc = inject(CategoriesService);
  categories$ = this.categoriesSvc.getAllCategories();

  private readonly messageService = inject(MessageService);
  
  showAddProductSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product added to cart successfully!' });
  }
  showAddProductError() {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add product to cart.' });
  }

  private tokenSub!: Subscription
  private token: string | null = null

  constructor(private readonly cartService: CartService, private readonly userService: UserKeyCloakService) {
  }

  ngOnInit(): void {
    this.tokenSub = this.userService.token$.subscribe((token: string | null) => {
      if (token) {
        this.token = token
      }
    })
  }


  public async addProduct(product: any) {
    if (!this.token) {
      throw new Error('Please log in first')
    }

    try {
      // Llamar al servicio para actualizar la cantidad del ítem
      const data: CreateOrderItemDto = { productId: product.id, quantity: 1 }
      const respone = await this.cartService.addOrderItem(data)
      console.log(respone)
      //console.log('Item añadido al carrito')
      this.showAddProductSuccess();
    } catch (error) {
      console.error('Error al agregar un nuevo producto:', error);
      this.showAddProductError();
    }


  }

}
