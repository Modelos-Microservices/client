import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class KeycloakGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  async canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    
    try {
      const keycloak = this.authService.getKeycloakInstance();
      
      // Verificar si Keycloak ya está inicializado
      if (!keycloak.authenticated) {
        console.log('Usuario no autenticado, iniciando login...');
        await this.authService.login();
        return false;
      }

      // Verificar si el token es válido
      if (keycloak.isTokenExpired()) {
        console.log('Token expirado, refrescando...');
        try {
          await keycloak.updateToken(30); // Refrescar si expira en 30 segundos
          console.log('Token refrescado exitosamente');
          return true;
        } catch (error) {
          console.log('No se pudo refrescar el token, redirigiendo al login');
          await this.authService.login();
          return false;
        }
      }

      return true;
      
    } catch (error) {
      console.error('Error en KeycloakGuard:', error);
      await this.authService.login();
      return false;
    }
  }
}