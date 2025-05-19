import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';



export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface CreateCategoryDTo {
  name: string;
  description: string;
}

export interface UpdateCategoryDTo {
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private readonly _http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/categories`;
  private readonly authService = inject(AuthService); // Inyecta el servicio de autenticación

  // Método para obtener todas las categorías
  getAllCategories(): Observable<Category[]> {
    return this._http.get<Category[]>(this.apiUrl);
  }


  // Método para obtener una categoría por su ID
  getCategoryById(id: string): Observable<Category> {
    return this._http.get<Category>(`${this.apiUrl}/${id}`);
  }

  // Método para crear una nueva categoría
  createCategory(createCategoryDTo: CreateCategoryDTo): Observable<Category> {
    return this._http.post<Category>(this.apiUrl, createCategoryDTo);
  }

  // Método para actualizar una categoría existente
  // updateCategory(id: string, category: UpdateCategoryDTo): Observable<Category> {
  //   const token = this.authService.getToken();
  //   if (token) {
  //     const headers = new HttpHeaders({
  //       'Authorization': `Bearer ${token}`
  //     });
  //     return this._http.patch<Category>(`${this.apiUrl}/${id}`, category, { headers });
  //   } else {
  //     console.error('No se pudo obtener el token de autenticación');
  //     return this._http.patch<Category>(`${this.apiUrl}/${id}`, category);
  //   }
  // }
  updateCategory(id: string, category: UpdateCategoryDTo): Observable<Category> {
  // Sin autenticación, si el endpoint debería ser público
  return this._http.patch<Category>(`${this.apiUrl}/${id}`, category);
}

  
  deleteCategory(id: string): Observable<void> {
    const token = this.authService.getToken();
    if (token) {
      const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
      return this._http.delete<void>(`${this.apiUrl}/${id}`, { headers });
    } else {
      console.error('No se pudo obtener el token de autenticación');
      return this._http.delete<void>(`${this.apiUrl}/${id}`);
    }
  }

  // Método para obtener una categoría por su nombre
  getCategoryByName(name: string): Observable<Category> {
    return this._http.get<Category>(`${this.apiUrl}?name=${name}`);
  }
}
