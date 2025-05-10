import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  UrlTree,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    const keycloak = this.authService.getKeycloakInstance();
    const isLoggedIn = keycloak.authenticated;

    // Si no está autenticado, redirigir al login
    if (!isLoggedIn) {
      return this.router.createUrlTree(['/login'], {
        queryParams: { returnUrl: state.url }
      });
    }

    // Verificar roles si están definidos en los datos de la ruta
    const requiredRoles = route.data['roles'] as Array<string>;
    
    if (requiredRoles && requiredRoles.length > 0) {
      // Verificar si el usuario tiene al menos uno de los roles requeridos
      const hasRequiredRole = requiredRoles.some(role => 
        keycloak.hasRealmRole(role) || 
        this.hasClientRole(keycloak, role)
      );

      if (!hasRequiredRole) {
        console.warn(`Usuario no tiene los roles requeridos: ${requiredRoles.join(', ')}`);
        return this.router.createUrlTree(['/unauthorized']);
      }
    }

    return true;
  }

  // Función auxiliar para verificar roles de cliente
  private hasClientRole(keycloak: any, role: string): boolean {
    // Formato esperado: "clientId:roleName"
    if (role.includes(':')) {
      const [clientId, roleName] = role.split(':');
      return keycloak.hasResourceRole(roleName, clientId);
    }
    return false;
  }
}