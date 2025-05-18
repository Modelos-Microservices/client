import { Component, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);
  private authSub!: Subscription;
  private fb = inject(FormBuilder);
  
  ngOnInit(): void {
    // Nos suscribimos al observable isLoggedIn$
    this.authSub = this.authService.isLoggedIn$.subscribe((loggedIn: boolean) => {
      if (loggedIn) {
        this.onUserLoggedIn();
      } else {
        this.onUserLoggedOut();
      }
    });
  }

 onUserLoggedIn() {
  console.log('Usuario ha iniciado sesión. Ejecutando lógica del componente...');
  this.router.navigate(['/']);
}

  onUserLoggedOut() {
    console.log('Usuario ha cerrado sesión.');
  }

  ngOnDestroy(): void {
    if(this.authSub){
        this.authSub.unsubscribe();
    }
  }

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });


  public async login(){
    await this.authService.login()
  }

  logout(): void {
    this.authService.logout();
  }

}