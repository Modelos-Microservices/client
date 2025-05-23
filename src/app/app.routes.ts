import { Routes } from '@angular/router';

// Importar componentes
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { HomeComponent } from './features/home/home.component';
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { ProductListComponent } from './features/products/product-list/product-list.component';
import { FavoritesComponent } from './features/favorites/favorites.component';
import { CartComponent } from './features/cart/cart.component';
import { CheckoutComponent } from './features/checkout/checkout.component';
import { ProfileComponent } from './features/profile/profile.component';
import { DashboardComponent } from './features/admin/dashboard/dashboard.component';
import { ProductCreateComponent } from './features/products/product-create/product-create.component';

// Importar guards
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

//import { canActivateAuthRole } from './core/guards/key-cloak.guard';
import { DebtsComponent } from './features/debts/debts.component';
import { SuccesComponent } from './features/payments/succes/succes.component';
import { KeycloakGuard } from './core/guards/key-cloak.guard';
import { UnauthorizedComponent } from './features/auth/unauthorized/unauthorized.component';

export const routes: Routes = [
  {
    path: '',
    component: UserLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'products-list', component: ProductListComponent },
      { path: 'unauthorized', component: UnauthorizedComponent },
      {
        path: 'products-create',
        component: ProductCreateComponent,
        canActivate: [RoleGuard],
        data:  { roles: ['admin'] }
      },
      { path: 'favorites', component: FavoritesComponent },
      { path: 'cart', component: CartComponent },
      { path: 'checkout', component: CheckoutComponent },
      { path: 'debts', component: DebtsComponent },
      { path: 'succes', component: SuccesComponent },
      { path: 'profile', component: ProfileComponent, canActivate: [KeycloakGuard], data: { role: 'user' } },
    ],
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    //canActivate: [AuthGuard, RoleGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
    ],
  },
  { path: '**', redirectTo: '' },
];
