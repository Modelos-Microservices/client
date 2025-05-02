import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import Keycloak from 'keycloak-js';
import { Router } from '@angular/router';

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private keycloak = new Keycloak({
    url: 'http://localhost:8080', // URL base de tu servidor Keycloak
    realm: 'nestjs-realm',        // El nombre de tu realm
    clientId: 'nestjs-app'        // El ID del cliente que usas
  });

  private isAuthenticated = false;
  private userProfile: any = null;

  constructor(private http: HttpClient, private router: Router) { }

  // Inicializa Keycloak al inicio de la aplicación
  async init(): Promise<boolean> {
    try {
      const authenticated = await this.keycloak
        .init({
          onLoad: 'check-sso', // Cambiado a check-sso para evitar redirecciones automáticas
          silentCheckSsoRedirectUri: window.location.origin + 'assets/silent-check-sso.html',
        });
      this.isAuthenticated = authenticated;
      if (authenticated) {
        this.loadUserProfile();
      }
      return authenticated;
    } catch (error) {
      console.error('Error al inicializar Keycloak:', error);
      return false;
    }
  }

  // Método para iniciar sesión con email y password
  login(username: string, password: string): Observable<boolean> {
    const url = `${this.keycloak.authServerUrl}/realms/${this.keycloak.realm}/protocol/openid-connect/token`;
    const body = new URLSearchParams();
    body.set('client_id', this.keycloak.clientId ?? 'nestjs-app');
    body.set('client_secret', '0rWWwZf5wJNxoxKnKFe1KrWmSl8W3BLu'); // Añade esta línea
    body.set('grant_type', 'password');
    body.set('username', username);
    body.set('password', password);


    return this.http.post<AuthResponse>(url, body.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).pipe(
      tap(response => {
        localStorage.setItem('token', response.access_token ?? '');
        localStorage.setItem('refresh_token', response.refresh_token ?? '');
        this.isAuthenticated = true;
      }),
      map(() => true),
      catchError(error => {
        console.error('Error de inicio de sesión:', error);
        return throwError(() => new Error('Credenciales inválidas'));
      })
    );
  }

  // Método para cerrar sesión
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    this.isAuthenticated = false;
    this.userProfile = null;

    // Opcional: redirigir a Keycloak para cerrar sesión completamente
    this.keycloak.logout({ redirectUri: window.location.origin });
  }

  // Obtener token para el interceptor
  getToken(): string | null {
    // Primero intenta obtener el token de Keycloak
    if (this.keycloak.token) {
      return this.keycloak.token;
    }
    // Si no hay token en Keycloak, intenta obtenerlo del localStorage
    return localStorage.getItem('token');
  }

  // Verifica si el usuario está autenticado
  isLoggedIn(): boolean {
    return this.isAuthenticated || !!localStorage.getItem('token');
  }

  // Carga el perfil del usuario autenticado
  private loadUserProfile(): void {
    if (this.isAuthenticated) {
      this.keycloak.loadUserProfile().then(profile => {
        this.userProfile = profile;
      }).catch(error => {
        console.error('Error al cargar el perfil del usuario:', error);
      });
    }
  }

  // Obtener información del perfil del usuario
  getUserProfile(): any {
    return this.userProfile;
  }

  // Acceso directo a la instancia de Keycloak
  getKeycloakInstance(): Keycloak {
    return this.keycloak;
  }
}