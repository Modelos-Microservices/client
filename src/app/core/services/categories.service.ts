import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';



export interface Category {
  id: string;
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  private readonly _http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/categories`;


  // Método para obtener todas las categorías
  getAllCategories(): Observable<Category[]> {
    return this._http.get<Category[]>(this.apiUrl);
  }


  // Método para obtener una categoría por su ID
  getCategoryById(id: string): Observable<Category> {
    return this._http.get<Category>(`${this.apiUrl}/${id}`);
  }

  // Método para crear una nueva categoría
  createCategory(category: Category): Observable<Category> {
    return this._http.post<Category>(this.apiUrl, category);
  }

  // Método para actualizar una categoría existente
  updateCategory(id: string, category: Category): Observable<Category> {
    return this._http.put<Category>(`${this.apiUrl}/${id}`, category);
  }

  // Método para eliminar una categoría
  deleteCategory(id: string): Observable<void> {
    return this._http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
  // Método para obtener una categoría por su nombre
  getCategoryByName(name: string): Observable<Category> {
    return this._http.get<Category>(`${this.apiUrl}?name=${name}`);
  }
}
