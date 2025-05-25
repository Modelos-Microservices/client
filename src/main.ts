import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config'; // Asumo que app.config.ts exporta ApplicationConfig
import { AppComponent } from './app/app.component';
import { defineCustomElements } from '@ionic/core/loader';

import { AuthService } from './app/core/services/auth.service';
import { ApplicationConfig } from '@angular/core';

// Importaciones para ngx-toastr y animaciones
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
// Importación para HttpClient si tu UserService lo necesita (muy probable)
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';


defineCustomElements(); // Para Ionic

const keycloakService = new AuthService();

keycloakService.initKeycloak().then(authenticated => {
  // Combina los providers de appConfig con los nuevos providers
  const combinedProviders = [
    ...(appConfig.providers || []), // Usa los providers existentes de appConfig
    { provide: AuthService, useValue: keycloakService },
    provideAnimations(), // Proveedor para las animaciones de Angular (necesarias para ngx-toastr)
    provideToastr({ // Proveedor para ngx-toastr con configuración opcional
      timeOut: 5000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      progressBar: true,
    }),
    provideHttpClient(), 
                                            
  ];

  const finalConfig: ApplicationConfig = {
    ...appConfig, // Extiende la configuración base
    providers: combinedProviders
  };

  bootstrapApplication(AppComponent, finalConfig)
    .catch(err => console.error(err)); // Buena práctica añadir un catch
});