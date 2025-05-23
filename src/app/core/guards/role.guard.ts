import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, map, take } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    
    // Obtener los roles permitidos desde la configuración de la ruta
    const allowedRoles = route.data['roles'] as string[];
    
    if (!allowedRoles || allowedRoles.length === 0) {
      console.warn('No se especificaron roles para esta ruta');
      return true; // Si no hay roles especificados, permitir acceso
    }

    return this.authService.role.pipe(
      take(1),
      map(userRoles => {
        // Verificar si el usuario está autenticado
        if (!this.authService.isLoggedIn) {
          console.log('Usuario no autenticado');
          this.router.navigate(['/login']);
          return false;
        }

        // Verificar si el usuario tiene alguno de los roles permitidos
        if (!userRoles || userRoles.length === 0) {
          console.log('Usuario sin roles asignados');
          this.router.navigate(['/unauthorized']);
          return false;
        }

        const hasRequiredRole = allowedRoles.some(role => userRoles.includes(role));
        
        if (!hasRequiredRole) {
          console.log(`Acceso denegado. Roles requeridos: ${allowedRoles.join(', ')}. Roles del usuario: ${userRoles.join(', ')}`);
          this.router.navigate(['/unauthorized']);
          return false;
        }

        return true;
      })
    );
  }
}