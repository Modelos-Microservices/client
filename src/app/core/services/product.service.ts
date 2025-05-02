import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';


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

  private readonly apiUrl = 'http://localhost:3000/api/products';
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


}