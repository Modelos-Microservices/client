import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from './user.service';
import { UserKeyCloakService } from './user-key-cloak.service';
import { AuthService } from './auth.service';
import { DebtDto } from '../entities/user.entitie';
import { UpdateDebtDto } from '../entities/debt.entitie';


@Injectable({
  providedIn: 'root'
})
export class DebtsService {

  private admin: boolean | null = null
  private apiUrl = 'http://localhost:3000/api/customer-debts';


  constructor(private readonly userService: UserKeyCloakService, private readonly authService: AuthService, private readonly http: HttpClient) {

  }

  async getDebts() {
    //En este caso hay dos posibles si es admin obtine todos las deudas de todos los usuarios
    //si es usuario solo obtiene las deudas de el
    const token = this.authService.token

    if (!token) throw new Error('No token provided')

    if (this.userService.isAdmin()) {
      return this.getAllDebts(token)
    } else {
      const userId = this.authService.getUserID()
      if (userId) {
        return this.getDebtsByUserId(userId, token);
      } else {
        console.error('No se encontró el ID de usuario.');
        throw new Error('No se encontró el ID de usuario.');
      }
    }
  }

  private async getDebtsByUserId(userId: string, token: string) {
    try {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
      })

      const response = await firstValueFrom(
        this.http.get<any>(`${this.apiUrl}/user/${userId}`, { headers })
      )

      return response.data || [];
    } catch (error) {
      console.error('Error al obtener las deudas del usuario:', error);
      throw error
    }
  }

  private async getAllDebts(token: string) {

    try {
      // Configuramos los headers con el token de autenticación
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      // Realizamos la petición con los headers configurados
      const response = await firstValueFrom(
        this.http.get<any>(this.apiUrl, { headers })
      );

      console.log('Response:', response.data);
      return response.data || [];
    } catch (error) {
      console.error('Error al obtener todas las deudas:', error);
      throw error;
    }
  }


  public async createNewDebt(debtData: DebtDto) {
    const token = this.authService.token

    try {
      // Configuramos los headers con el token de autenticación
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      // Realizamos la petición con los headers configurados
      const response = await firstValueFrom(
        this.http.post<DebtDto>(`${this.apiUrl}/user`, debtData, { headers })
      );

      console.log('Response:', response);
      return response || [];
    } catch (error) {
      console.error('Error al obtener todas las deudas:', error);
      throw error;
    }
  }


  public async payDebt(debtData: UpdateDebtDto) {
    const token = this.authService.token

    try {
      // Configuramos los headers con el token de autenticación
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });

      // Realizamos la petición con los headers configurados
      const response = await firstValueFrom(
        this.http.patch<DebtDto>(`${this.apiUrl}`, debtData, { headers })
      );

      console.log('Response:', response);
      return response || [];
    } catch (error) {
      console.error('Error al obtener todas las deudas:', error);
      throw error;
    }
  }

}
