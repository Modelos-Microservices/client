import { Injectable } from '@angular/core';
import { UserKeyCloakService } from './user-key-cloak.service';
import { AuthService } from './auth.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { DeleteOrderItemDto, UpdateOrderItemDto } from '../entities/order.entitie';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private apiUrl = 'http://localhost:3000/api/orders';
  private token : string | null = null

  constructor(private readonly userService: UserKeyCloakService, private readonly authService: AuthService, private readonly http: HttpClient) {
     this.authService.token$.subscribe(token => {
      this.token = token;
    });
  }


  async getUserCart() {
     const token = await firstValueFrom(this.authService.token$);

    if (!token) throw new Error('No token provided')

    const userId = this.authService.getUserID()

    if (!userId) throw new Error('No userId Found')
    
    try {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
      })

      const response = await firstValueFrom(
        this.http.get<any>(`${this.apiUrl}/cart`, { headers })
      )

      return response;
    } catch (error) {
      console.error('Error al obtener el cart del usuario:', error);
      throw error
    }

  }

  async updateOrderItem(updateOrderItemData: UpdateOrderItemDto) {
     const token = await firstValueFrom(this.authService.token$);

    if (!token) throw new Error('No token provided')

    const userId = this.authService.getUserID()

    if (!userId) throw new Error('No userId Found')
    
    try {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
      })

      const response = await firstValueFrom(
        this.http.patch<any>(`${this.apiUrl}/update`, updateOrderItemData, { headers })
      )

      return response;
    } catch (error) {
      console.error('Error al obtener el cart del usuario:', error);
      throw error
    }

  }


  async deleteOrderItem(deleteOrderItemData: DeleteOrderItemDto) {
     const token = await firstValueFrom(this.authService.token$);

    if (!token) throw new Error('No token provided')

    const userId = this.authService.getUserID()

    if (!userId) throw new Error('No userId Found')
    
    try {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
      })

      const response = await firstValueFrom(
        this.http.patch<any>(`${this.apiUrl}/delete`, deleteOrderItemData, { headers })
      )

      return response;
    } catch (error) {
      console.error('Error al obtener el cart del usuario:', error);
      throw error
    }

  }

  async payOrder() {
    const token = await firstValueFrom(this.authService.token$);

    if (!token) throw new Error('No token provided')
    
    try {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`,
      })

      const response = await firstValueFrom(
        this.http.post<any>(`${this.apiUrl}/pay`, {}, { headers })
      )
      return response;
    } catch (error) {
      throw error
    }

  }


}
