import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { AuthService } from './app/core/services/auth.service'; 
import { ApplicationConfig } from '@angular/core';

const keycloakService = new AuthService();

keycloakService.initKeycloak().then(authenticated => {
  const config: ApplicationConfig = {
    ...appConfig,
    providers: [
      ...appConfig.providers!,
      { provide: AuthService, useValue: keycloakService }
    ]
  };
  bootstrapApplication(AppComponent, config);
});