import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [ CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
// ...existing code...

export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  private authSubscription!: Subscription;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    // Comprueba el estado inicial
    this.isLoggedIn = this.authService.isLoggedIn;
    
    // Suscribirse a cambios futuros en el estado de autenticación
    this.authSubscription = this.authService.isLoggedIn$.subscribe(
      status => {
        this.isLoggedIn = status;
      }
    );
  }

  ngOnDestroy(): void {
    // Importante para evitar memory leaks
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

   logout(): void {
    this.authService.logout();
  }



}
