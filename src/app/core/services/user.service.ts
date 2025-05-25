import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { firstValueFrom, Observable } from 'rxjs';
import { createUserDtoKeyCloak } from '../entities/user.dto';


export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  imgUrl: string;
}


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly _http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/users`;

  // Método para obtener todos los usuarios
  getAllUsers(): Observable<User[]> {
    return this._http.get<User[]>(this.apiUrl);
  }

  // Método para obtener un usuario por su ID
  getUserById(id: string): Observable<User> {
    return this._http.get<User>(`${this.apiUrl}/${id}`);
  }

  // Método para crear un nuevo usuario
  createUser(user: User): Observable<User> {
    return this._http.post<User>(this.apiUrl, user);
  }

  // Método para actualizar un usuario existente
  updateUser(id: string, user: User): Observable<User> {
    return this._http.put<User>(`${this.apiUrl}/${id}`, user);
  }

  // Método para eliminar un usuario
  deleteUser(id: string): Observable<void> {
    return this._http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Método para obtener un usuario por su nombre
  getUserByName(name: string): Observable<User> {
    return this._http.get<User>(`${this.apiUrl}?name=${name}`);
  }


  //Metodo para crear un usuario
  async createUserKeyCloak(data: createUserDtoKeyCloak) {
    try {
      const response = await firstValueFrom( this._http.post<any>('http://localhost:3000/api/keyCloak/register', data));
      console.log(response)
      return true
    } catch (error) {
      console.log(error)
      throw error
    }
  }

}
