import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Interfaces para los datos
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  avatarUrl: string;
  joinDate: Date;
}

interface OrderStatus {
  completed: string;
  processing: string;
  shipped: string;
  cancelled: string;
}

interface Order {
  id: string;
  date: Date;
  status: keyof OrderStatus;
  total: number;
  itemCount: number;
}

interface UserPreferences {
  emailNotifications: boolean;
  cartReminders: boolean;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  // Datos del usuario
  user: User | null = null;
  
  // Formulario para editar perfil
  profileForm: FormGroup;
  
  // Estado del formulario
  isSubmitting = false;
  
  // Historial de pedidos
  orders: Order[] = [];
  
  // Preferencias de usuario
  preferences: UserPreferences = {
    emailNotifications: true,
    cartReminders: false
  };
  
  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    // Inicializar formulario
    this.profileForm = this.fb.group({
      name: ['', Validators.required],
      phone: [''],
      address: [''],
      city: [''],
      zipCode: ['']
    });
  }
  
  ngOnInit(): void {
    // Cargar datos del usuario
    this.loadUserData();
    
    // Cargar historial de pedidos
    this.loadOrderHistory();
    
    // Cargar preferencias
    this.loadPreferences();
  }
  
  // Cargar datos del usuario (simulado)
  loadUserData(): void {
    // Simulamos una carga de datos de API
    setTimeout(() => {
      this.user = {
        id: '12345',
        name: 'Diego García',
        email: 'diego@example.com',
        phone: '301-234-5678',
        address: 'Calle Principal 123',
        city: 'Pasto',
        zipCode: '52001',
        avatarUrl: 'https://i.pravatar.cc/300',
        joinDate: new Date(2023, 5, 15)
      };
      
      // Actualizar formulario con datos del usuario
      this.profileForm.patchValue({
        name: this.user.name,
        phone: this.user.phone,
        address: this.user.address,
        city: this.user.city,
        zipCode: this.user.zipCode
      });
    }, 1000);
  }
  
  // Cargar historial de pedidos (simulado)
  loadOrderHistory(): void {
    this.orders = [
      {
        id: '1001',
        date: new Date(2023, 10, 15),
        status: 'completed',
        total: 125.99,
        itemCount: 3
      },
      {
        id: '1002',
        date: new Date(2023, 11, 2),
        status: 'shipped',
        total: 79.50,
        itemCount: 2
      },
      {
        id: '1003',
        date: new Date(),
        status: 'processing',
        total: 199.99,
        itemCount: 4
      }
    ];
  }
  
  // Cargar preferencias (simulado)
  loadPreferences(): void {
    const savedPreferences = localStorage.getItem('user_preferences');
    if (savedPreferences) {
      this.preferences = JSON.parse(savedPreferences);
    }
  }
  
  // Actualizar perfil
  updateProfile(): void {
    if (this.profileForm.invalid) {
      return;
    }
    
    this.isSubmitting = true;
    
    // Simulamos una llamada a la API
    setTimeout(() => {
      this.isSubmitting = false;
      
      // Actualizar datos del usuario
      if (this.user) {
        this.user = {
          ...this.user,
          ...this.profileForm.value
        };
      }
      
      // Aquí iría la lógica para guardar en el backend
      console.log('Perfil actualizado:', this.profileForm.value);
      
      // Mostrar algún mensaje de éxito
      alert('Perfil actualizado con éxito');
    }, 1500);
  }
  
  // Guardar preferencias
  savePreferences(): void {
    localStorage.setItem('user_preferences', JSON.stringify(this.preferences));
    console.log('Preferencias guardadas:', this.preferences);
    
    // Mostrar mensaje de éxito
    alert('Preferencias guardadas con éxito');
  }
  
  // Obtener etiqueta de estado para pedidos
  getStatusLabel(status: string): string {
    const statusLabels: OrderStatus = {
      completed: 'Completado',
      processing: 'En proceso',
      shipped: 'Enviado',
      cancelled: 'Cancelado'
    };
    
    return statusLabels[status as keyof OrderStatus] || status;
  }
  
  // Abrir modal para cambiar contraseña
  openChangePasswordModal(): void {
    // Aquí implementarías la lógica para abrir un modal o navegar a una página de cambio de contraseña
    console.log('Abrir modal de cambio de contraseña');
  }
  
  // Cerrar sesión
  logout(): void {
    // Implementar lógica de cierre de sesión
    console.log('Cerrando sesión...');
    
    // Navegar a la página de inicio
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 500);
  }
}