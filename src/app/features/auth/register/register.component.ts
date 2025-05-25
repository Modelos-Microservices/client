import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr'; // 1. Importa ToastrService

import { UserService } from '../../../core/services/user.service';
import { createUserDtoKeyCloak } from '../../../core/entities/user.dto';

@Component({
  selector: 'app-register',
  standalone: true, // Es importante que sea standalone si no tienes módulos separados
  imports: [
    CommonModule,
    ReactiveFormsModule
    // No necesitas BrowserAnimationsModule ni ToastrModule aquí si están proveídos globalmente
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  isSubmitting = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService,
    private toastr: ToastrService // 2. Inyecta ToastrService
  ) { }

  ngOnInit(): void {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-zA-Z0-9._-]+$/)]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/)
        ]
      ],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    } else if (confirmPassword && confirmPassword.hasError('passwordMismatch')) {
      confirmPassword.setErrors(null);
    }
    return null;
  }

  isFieldInvalid(field: string): boolean | undefined {
    const control = this.registerForm.get(field);
    return control?.invalid && (control?.touched || control?.dirty);
  }

  isFieldValid(field: string): boolean | undefined {
    const control = this.registerForm.get(field);
    return control?.valid && (control?.touched || control?.dirty);
  }

  getPasswordStrength(): number {
    const password = this.registerForm.get('password')?.value || '';
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/\d/)) strength++;
    if (password.match(/[^a-zA-Z\d]/)) strength++;
    if (password.length >= 10 && strength >= 3) strength++;
    return Math.min(strength, 5);
  }

  async onSubmit(): Promise<void> { // La función async ya devuelve una Promise<void>
    this.errorMessage = null;

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.errorMessage = 'Por favor, corrige los errores en el formulario.';
      // Opcional: Mostrar un toast si el formulario es inválido al intentar enviar
      this.toastr.warning('Algunos campos son inválidos. Por favor, revísalos.', 'Formulario Incompleto');
      return;
    }

    this.isSubmitting = true;

    const valueForm = this.registerForm.value;
    const data: createUserDtoKeyCloak = {
      username: valueForm.username,
      password: valueForm.password,
      lastName: valueForm.lastName,
      firstName: valueForm.firstName,
      email: valueForm.email,
      enabled: true,
      isTemporaryPassword: false
    };

    console.log('Enviando datos para creación de usuario:', data);

    try {
      const result = await this.userService.createUserKeyCloak(data);
      // Asumiendo que si `createUserKeyCloak` no lanza error, fue exitoso.
      // Si `result` contiene información útil, puedes usarla.
      console.log('Usuario creado con éxito:', result);
      this.toastr.success('¡Cuenta creada exitosamente! Redirigiendo al login...', 'Registro Completo');
      this.registerForm.reset(); // Limpiar el formulario tras el éxito

      // Opcional: Redirigir después de un pequeño retraso para que el usuario vea el toast
      setTimeout(() => {
        this.router.navigate(['/login']); // Ajusta esta ruta según tu aplicación
      }, 2000); // 2 segundos de espera

    } catch (error: any) { // Es buena práctica tipar el error (ej. HttpErrorResponse)
      console.error('Error durante el registro:', error);

      // Intenta obtener un mensaje más específico del error si está disponible
      // Esto depende de cómo tu backend (Keycloak o tu API intermedia) devuelva los errores
      let friendlyErrorMessage = 'Ocurrió un error al crear la cuenta. Inténtalo más tarde.';
      if (error?.error?.message) {
        friendlyErrorMessage = error.error.message;
      } else if (error?.error?.errorMessage) { // Keycloak a veces usa 'errorMessage'
        friendlyErrorMessage = error.error.errorMessage;
      } else if (error?.message) {
        friendlyErrorMessage = error.message;
      } else if (typeof error === 'string') {
        friendlyErrorMessage = error;
      }

      this.errorMessage = friendlyErrorMessage; // Para mostrar en el div de error del HTML
      this.toastr.error(friendlyErrorMessage, 'Error de Registro');
      // No es necesario hacer 'throw error' aquí si ya lo estás manejando (mostrando toast y mensaje).
      // Si lo relanzas, asegúrate de que haya un manejador de errores global que lo capture.
    } finally {
      this.isSubmitting = false; // Asegura que el botón se reactive en cualquier caso (éxito o error)
    }
  }
}