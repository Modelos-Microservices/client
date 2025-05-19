import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AuthService } from './auth.service';

// environment
import { environment } from '../../../environments/environment';

export interface Product {
  id: number
  name: string;
  description: string;
  price: number;
  stock: number;
  available: boolean;
  categoryId: string;
  imageUrl: string;
  discountPercentage: number;
}

export interface CreateProductDTO {
  name: string;
  description: string;
  price: number;
  stock: number;
  available: boolean;
  categoryId: string;
  imageUrl: string;
  discountPercentage: number;
}

export interface UpdateProductDTO {
  name: string;
  description: string;
  price: number;
  stock: number;
  available: boolean;
  categoryId: string;
  imageUrl: string;
  discountPercentage: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly _http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/products`;
  private readonly authService = inject(AuthService);

  

  // Me´todo para obtener todos los productos
  getAllProducts(): Observable<Product[]> {
    return this._http.get<{meta: any, data: Product[]}>(this.apiUrl)
      .pipe(
        map(response => response.data)
      );
  }

  // getAllProducts(): Observable<Product[]> {
  //   const token = this.authService.getToken();
    
  //   if (token) {
  //     const headers = new HttpHeaders({
  //       Authorization: `Bearer ${token}`
  //     });
  //     return this._http.get<Product[]>(this.apiUrl, { headers });
  //   } else {
  //     console.warn('No hay token disponible, la solicitud probablemente fallará');
  //     return this._http.get<Product[]>(this.apiUrl);
  //   }
    
  // }

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
  createProduct(createProductDTO: CreateProductDTO): Observable<Product> {
    const token = this.authService.getToken();
    
    if (token) {
      const headers = new HttpHeaders({

        Authorization: `Bearer ${token}`

      });
      return this._http.post<Product>(`${environment.apiUrl}/products`, createProductDTO, { headers });
    } else {
      console.warn('No hay token disponible, la solicitud probablemente fallará');
      return this._http.post<Product>(this.apiUrl, createProductDTO);
    }
  }

  // updateProduct(id: string, product: UpdateProductDTO): Observable<Product> {
  //   const token = this.authService.getToken();
    
  //   if (token) {
  //     const headers = new HttpHeaders({
  //       Authorization: `Bearer ${token}`
  //     });
  //     return this._http.patch<Product>(`${environment.apiUrl}/products/${id}`, product, { headers });
  //   } else {
  //     console.warn('No hay token disponible, la solicitud probablemente fallará');
  //     return this._http.patch<Product>(`${this.apiUrl}/${id}`, product);
  //   }
  // }
  //metodo de update sin token
    updateProduct(id: number, product: UpdateProductDTO): Observable<Product> {
    const headers = new HttpHeaders({

      'Content-Type': 'application/json'
      
    });
    
    const body = {
      id: id,
      ...product
    };
    
    console.log('Datos enviados al API:', body);
    
    return this._http.patch<Product>(`${this.apiUrl}/${id}`, body, { headers });
  }

  // Método para eliminar un producto

  deleteProduct(id: number): Observable<void> {
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