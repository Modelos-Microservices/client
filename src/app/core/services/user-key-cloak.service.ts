import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { userDebts, UserKeyCloak } from '../entities/user.entitie';

@Injectable({
  providedIn: 'root'
})
export class UserKeyCloakService {

  private admin = new BehaviorSubject<boolean>(false)
  public admin$ = this.admin.asObservable()
  private apiUrl: string | null = null;
  private token: string | null = null;
  private userRole: String[] | null = null

  constructor(private readonly authService: AuthService, private readonly http: HttpClient) {
    this.apiUrl = this.authService.backendUrl + 'customer-debts/keycloak';
    //nos suscribimos al observable de token para obtener el token de acceso y sus futuras actualizaciones
    //cada vez que el token cambie, se actualizará la variable token  
    this.authService.token$.subscribe(token => {
      this.token = token;
    });

    this.authService.role.subscribe(roles => {
      this.userRole = roles
      this.admin.next(this.isAdmin())
    })
  }

  public isAdmin(): boolean {
    return this.userRole?.includes('admin') ?? false;
  }

  public async getAllUsersNames(): Promise<userDebts[] | null> {
    try {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${this.token}`
      })

      let users: UserKeyCloak[]
      if (this.apiUrl) {
        users = await firstValueFrom(this.http.get<UserKeyCloak[]>(this.apiUrl, { headers }))
      } else {
        throw new Error('No url found')
      }
      return users.map( user => {return({id: user.id, username: user.username})})
    } catch (error) {
      console.log(error)
      return null
    }
  }
}
