import { computed, Injectable, Signal } from '@angular/core';
import Keycloak from 'keycloak-js';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public url = 'http://localhost:3000/api/';
  private keycloak: Keycloak;
  // BehaviorSubject: Es un tipo especial de Observable de RxJS que almacena el último valor emitido y lo entrega inmediatamente a cualquier nuevo suscriptor. También necesita un valor inicial.

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  private tokenSubject = new BehaviorSubject<string | null>(null);
  private user_role = new BehaviorSubject<string[] | null>(null);
  //un observable es una forma de manejar datos asíncronos en JavaScript. En este caso, se está utilizando para manejar el estado de autenticación y el token de acceso. y podemos suscribirnos a él para recibir actualizaciones. desde otros servicios o componentes.
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();
  public token$ = this.tokenSubject.asObservable();
  public role = this.user_role.asObservable()
  private validRoles: string[] = ['admin', 'user']


  get isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  get token(): string | null {
    return this.tokenSubject.value;
  }

public getUserID(): string | null {
  if (this.isLoggedIn && this.token) {
    const payload = this.decodeToken(this.token);
    return payload?.sub || null; // "sub" es el ID del usuario por defecto en Keycloak
  }
  return null;
}

  public getToken(): string | null {
    return this.tokenSubject.value;
  }

  get backendUrl(): string {
    return this.url;
  }

  getKeycloakInstance() {
    return this.keycloak
  }

  constructor() {

    this.keycloak = new Keycloak({
      url: 'http://localhost:8080/',
      realm: 'nestjs-realm',
      clientId: 'angular-app'
    });
  }

  public initKeycloak(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      //el metodo init permite inicializar la instancia de Keycloak y establecer la configuración inicial.
      this.keycloak.init({
        onLoad: 'check-sso',
      })
        //en caso de ser exitoso
        .then(authenticated => {
          if (authenticated) {
            // actualiza el estado de autenticación a 'true'
            this.isLoggedInSubject.next(true);
            // una vez autenticado, se puede acceder al token de acceso
            if (this.keycloak.token) {
              this.tokenSubject.next(this.keycloak.token);
              this.user_role.next(this.getUserRole())
            }
            console.log('Usuario autenticado');

          } else {
            console.log('No autenticado');
          }
          //Resuelve la Promesa que creaste en la línea 27 con el estado de autenticación. Esto es lo que recibirá quien llame a 'initKeycloak()'.
          resolve(authenticated);
        })
        .catch(error => {
          console.error('Error al inicializar Keycloak', error);
          reject(error);
        });
    });
  }

  // función para refrescar el token de acceso
  public logout(): void {
    // función para cerrar sesión globalmente
    this.keycloak.logout()
      .then(() => {
        this.tokenSubject.next(null);
        this.isLoggedInSubject.next(false);
      })
      .catch(error => console.error('Error al cerrar sesión', error));
  }


  public async login(): Promise<void> {
    try {
      await this.keycloak.login();
    } catch (error) {
    }
  }

  private getUserRole() {
    if (this.isLoggedIn && this.token) {
      const tokenDecode = this.decodeToken(this.token)
      if (tokenDecode?.realm_access?.roles) {
        return tokenDecode.realm_access.roles.filter((role: string) =>
          this.validRoles.includes(role)
        );
      } else {
        console.log("you have to log in first")
      }
    }
  }

  private decodeToken(token: string): any {
    try {
      // El token JWT tiene 3 partes: header.payload.signature
      // Nos interesa el payload (parte 2)
      const payload = token.split('.')[1];

      // Decodificar el base64
      const decodedPayload = atob(payload);

      // Convertir el JSON string a objeto
      return JSON.parse(decodedPayload);
    } catch (error) {
      console.error('Error al decodificar el token:', error);
      return null;
    }
  }

}