import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, Observable, Subscription, map } from 'rxjs';
import { Product } from '../../core/services/product.service';
import { Router } from '@angular/router';
import { DeleteOrderItemDto, Order, OrderItem, UpdateOrderItemDto } from '../../core/entities/order.entitie';
import { CartService } from '../../core/services/cart.service';
import { UserKeyCloakService } from '../../core/services/user-key-cloak.service';

// Definir interfaces
export interface CartItem {
  product: Product;
  quantity: number;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  // Inyección de dependencias
  private router = inject(Router);

  private authSub!: Subscription
  private tokenSub!: Subscription
  private modifiedItems = new Map<string, boolean>(); // Rastrear ítems modificados

  public emptyCart: boolean = true
  public isLoggedInd: boolean = false
  public order: Order | null = null
  public orderItems: OrderItem[] | null = null

  constructor(private readonly cartService: CartService, private readonly userService: UserKeyCloakService) {
  }

  ngOnInit(): void {
    // Nos suscribimos al observable isLoggedIn$
    this.authSub = this.userService.isLoggedIn$.subscribe((logged: boolean) => {
      this.isLoggedInd = logged
    });

    this.tokenSub = this.userService.token$.subscribe((token : string | null) => {
      if(token){
        this.loadCart()
      }
    })
  }

  private async loadCart() {
    this.order = await this.cartService.getUserCart()
    if(this.order){
      this.orderItems = this.order?.OrderItem
      this.emptyCart = false
      // Limpiar modificaciones al recargar el carrito
      this.modifiedItems.clear();
    }
  }

  // Verificar si un ítem tiene una cantidad modificada
  isQuantityModified(itemId: string): boolean {
    return this.modifiedItems.get(itemId) || false;
  }

  // Manejar cambios en el input de cantidad
  onQuantityChange(item: OrderItem) {
    // Validar que la cantidad sea al menos 1
    if (item.quantity < 1) {
      item.quantity = 1;
    }
    // Marcar el ítem como modificado
    this.modifiedItems.set(item.id, true);
  }

  // Confirmar y guardar la cantidad del ítem
  async saveQuantity(item: OrderItem) {
    try {
      // Validar que la cantidad sea al menos 1
      if (item.quantity < 1) {
        item.quantity = 1;
      }
      // Llamar al servicio para actualizar la cantidad del ítem
      const data : UpdateOrderItemDto = {newQuantity: item.quantity, productId: item.productId}
      await this.cartService.updateOrderItem(data)
      console.log(`Cantidad del ítem ${item.productName} actualizada a ${item.quantity}`);
      // Limpiar la bandera de modificación
      this.modifiedItems.delete(item.id);
      this.loadCart()
    } catch (error) {
      console.error('Error al actualizar la cantidad:', error);
      // Recargar el carrito para restaurar el estado en caso de error
      this.loadCart();
    }
  }

    async deleteItem(item: OrderItem) {
    try {
      // Validar que la cantidad sea al menos 1
      if (item.quantity < 1) {
        item.quantity = 1;
      }
      // Llamar al servicio para actualizar la cantidad del ítem
      const data : DeleteOrderItemDto = {productId: item.productId}
      await this.cartService.deleteOrderItem(data)
      console.log(`${item.productName} Eliminado correctamente`);
      this.loadCart()
    } catch (error) {
      console.error('Error al elminar el producto', error);
      // Recargar el carrito para restaurar el estado en caso de error
      this.loadCart();
    }
  }

  async payOrder() {
    try {
      // Llamar al servicio para actualizar la cantidad del ítem
      const response = await this.cartService.payOrder()
      console.log(response.payment.url);
      window.location.href = response.payment.url;
    } catch (error) {
      console.error('Error pagar', error);
      // Recargar el carrito para restaurar el estado en caso de error
    }
  }
}