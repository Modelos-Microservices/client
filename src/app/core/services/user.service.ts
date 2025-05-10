import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';


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

}
