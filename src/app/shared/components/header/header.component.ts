import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, HostListener, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Subscription } from 'rxjs';
import { UserKeyCloakService } from '../../../core/services/user-key-cloak.service';

@Component({
  selector: 'app-header',
  imports: [ CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]})

export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  private authSubscription!: Subscription;

  showMobileMenu: boolean = false;

  private authSub!: Subscription
  public admin: boolean | null = null
  isScrolled: boolean = false;

  constructor(private authService: AuthService, private readonly userService: UserKeyCloakService) { }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    // Cambia cuando el scroll sea mayor a 100px
    this.isScrolled = window.scrollY > 100;
  }
  
  ngOnInit(): void {
    // Comprueba el estado inicial
    //this.isLoggedIn = this.authService.isLoggedIn;
    
    // Suscribirse a cambios futuros en el estado de autenticación
    this.authSubscription = this.authService.isLoggedIn$.subscribe(
      status => {
        this.isLoggedIn = status;
      }
    );
    this.authSub = this.userService.admin$.subscribe((admin: boolean) => {
      this.admin = admin
    })
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
