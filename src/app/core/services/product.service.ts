import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

// environment
import { environment } from '../../../environments/environment';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  categorieId: string;
  imgUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly _http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/products`;
  private readonly authService = inject(AuthService); // Inyecta el servicio de autenticación

  

  // // Me´todo para obtener todos los productos
  // getAllProducts(): Observable<Product[]> {
  //   // const headers = new HttpHeaders({
  //   //   Authorization: 'Bearer PKwu---rQWjyKMg8IMJBcJ--wEt----BW-awpX-4bmiRQ' ,
  //   // });

  //   // return this._http.get<Product[]>(this.apiUrl, { headers });

  //   //sin headers
  //   return this._http.get<Product[]>(this.apiUrl);
  // }
  getAllProducts(): Observable<Product[]> {
    const token = this.authService.getToken();
    
    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
      });
      return this._http.get<Product[]>(this.apiUrl, { headers });
    } else {
      console.warn('No hay token disponible, la solicitud probablemente fallará');
      return this._http.get<Product[]>(this.apiUrl);
    }
    
  }

  // Método para obtener un producto por su ID
  getProductById(id: string): Observable<Product> {
    const token = this.authService.getToken();
    
    if (token) {
      const headers = new HttpHeaders({


        Authorization: `Bearer ${token}`
      });
      return this._http.get<Product>(`${environment.apiUrl}/products/${id}`, { headers });
    } else {
      console.warn('No hay token disponible, la solicitud probablemente fallará');
      return this._http.get<Product>(`${this.apiUrl}/${id}`);
    }
  }

  // Método para crear un nuevo producto
  createProduct(product: Product): Observable<Product> {
    const token = this.authService.getToken();
    
    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
      });
      return this._http.post<Product>(`${environment.apiUrl}/products`, product, { headers });
    } else {
      console.warn('No hay token disponible, la solicitud probablemente fallará');
      return this._http.post<Product>(this.apiUrl, product);
    }
  }

  // Método para actualizar un producto existente
  updateProduct(id: string, product: Product): Observable<Product> {
    const token = this.authService.getToken();
    
    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
      });
      return this._http.put<Product>(`${environment.apiUrl}/products/${id}`, product, { headers });
    } else {
      console.warn('No hay token disponible, la solicitud probablemente fallará');
      return this._http.put<Product>(`${this.apiUrl}/${id}`, product);
    }
  }
  // Método para eliminar un producto

  deleteProduct(id: string): Observable<void> {
    const token = this.authService.getToken();
    
    if (token) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
      });
      return this._http.delete<void>(`${environment.apiUrl}/products/${id}`, { headers });
    } else {
      console.warn('No hay token disponible, la solicitud probablemente fallará');
      return this._http.delete<void>(`${this.apiUrl}/${id}`);
    }
  }
}