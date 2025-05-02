import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../../core/services/product.service';
import { CartItem } from '../cart/cart.component';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.css'
})
export class FavoritesComponent implements OnInit {
  // Estado de carga
  loading = true;
  
  // Estado de los favoritos (BehaviorSubject para mantener estado)
  private favoritesSubject = new BehaviorSubject<Product[]>([]);
  favorites$: Observable<Product[]> = this.favoritesSubject.asObservable();

  ngOnInit(): void {
    // Simulamos un pequeño retardo para mostrar el loading
    setTimeout(() => {
      this.loadFavorites();
      this.loading = false;
    }, 800);
  }

  // Cargar favoritos desde localStorage
  private loadFavorites(): void {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      this.favoritesSubject.next(JSON.parse(savedFavorites));
    } else {
      this.favoritesSubject.next([]);
    }
  }

  // Guardar favoritos en localStorage
  private saveFavorites(favorites: Product[]): void {
    localStorage.setItem('favorites', JSON.stringify(favorites));
    this.favoritesSubject.next(favorites);
  }

  // Eliminar un producto de favoritos
  removeFromFavorites(product: Product): void {
    const favorites = this.favoritesSubject.value;
    const updatedFavorites = favorites.filter(p => p.id !== product.id);
    this.saveFavorites(updatedFavorites);
  }

  // Añadir producto al carrito
  addToCart(product: Product): void {
    // Obtener el carrito actual
    const savedCart = localStorage.getItem('cart');
    let cart: CartItem[] = [];
    
    if (savedCart) {
      cart = JSON.parse(savedCart);
    }
    
    // Verificar si el producto ya está en el carrito
    const existingItem = cart.find(item => item.product.id === product.id);
    
    if (existingItem) {
      // Si ya existe, aumentar la cantidad
      existingItem.quantity += 1;
    } else {
      // Si no existe, añadir como nuevo item
      cart.push({
        product: product,
        quantity: 1
      });
    }
    
    // Guardar el carrito actualizado
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Opcionalmente, mostrar alguna notificación de éxito
    this.showAddToCartSuccess();
  }

  // Método para mostrar notificación (puede ser implementado con una librería de notificaciones)
  private showAddToCartSuccess(): void {
    // Aquí podrías implementar una notificación toast, por ejemplo
    console.log('Producto añadido al carrito');
    
    // Como alternativa simple, puedes usar alert, aunque no es lo más recomendable para UX
    // alert('Producto añadido al carrito');
  }
}