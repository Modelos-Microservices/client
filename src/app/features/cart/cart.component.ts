import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Product } from '../../core/services/product.service';
import { Router } from '@angular/router';

// Definir interfaces
export interface CartItem {
  product: Product;
  quantity: number;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  // Inyección de dependencias
  private router = inject(Router);
  
  // Estado del carrito (BehaviorSubject para mantener estado)
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  cart$: Observable<CartItem[]> = this.cartSubject.asObservable();
  
  // Variables para los totales
  subtotal = 0;
  shipping = 5.99; // Valor fijo para el envío
  taxes = 0;
  total = 0;

  ngOnInit(): void {
    // Cargar el carrito desde localStorage al iniciar
    this.loadCart();
    
    // Suscribirse a cambios en el carrito para actualizar totales
    this.cart$.subscribe(cart => {
      this.calculateTotals(cart);
    });
  }

  // Cargar carrito desde localStorage
  private loadCart(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartSubject.next(JSON.parse(savedCart));
    }
  }

  // Guardar carrito en localStorage
  private saveCart(cart: CartItem[]): void {
    localStorage.setItem('cart', JSON.stringify(cart));
    this.cartSubject.next(cart);
  }

  // Aumentar cantidad de un producto
  increaseQuantity(item: CartItem): void {
    const cart = this.cartSubject.value;
    const index = cart.findIndex(i => i.product.id === item.product.id);
    if (index !== -1) {
      cart[index].quantity += 1;
      this.saveCart([...cart]);
    }
  }

  // Disminuir cantidad de un producto
  decreaseQuantity(item: CartItem): void {
    const cart = this.cartSubject.value;
    const index = cart.findIndex(i => i.product.id === item.product.id);
    if (index !== -1 && cart[index].quantity > 1) {
      cart[index].quantity -= 1;
      this.saveCart([...cart]);
    } else if (index !== -1 && cart[index].quantity === 1) {
      this.removeFromCart(item);
    }
  }

  // Eliminar un producto del carrito
  removeFromCart(item: CartItem): void {
    const cart = this.cartSubject.value;
    const filteredCart = cart.filter(i => i.product.id !== item.product.id);
    this.saveCart(filteredCart);
  }

  // Calcular totales
  calculateTotals(cart: CartItem[]): void {
    this.subtotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    this.taxes = this.subtotal * 0.19; // 19% de impuestos
    this.total = this.subtotal + this.shipping + this.taxes;
  }

  // Proceder al checkout
  checkout(): void {
    // Aquí se implementaría la lógica de redirección al checkout
    this.router.navigate(['/checkout']);
  }

  // Método para limpiar el carrito (útil después del checkout)
  clearCart(): void {
    this.saveCart([]);
  }
}