import { Component, inject, OnInit } from '@angular/core';
import { DebtsService } from '../../core/services/debts.service';
import { UserKeyCloakService } from '../../core/services/user-key-cloak.service';
import { firstValueFrom, Subscription } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DebtDto, userDebts } from '../../core/entities/user.entitie';
import { CommonModule } from '@angular/common';
import { UpdateDebtDto } from '../../core/entities/debt.entitie';
import { DebtStatus } from '../../core/enum/debts.enum';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
// Asumo que Debt tiene una propiedad id y status
// import { Debt } from '../../core/entities/debt.entitie'; 

interface Debt {
  id: string;
  user_name: string;
  user_id: string;
  description: string;
  amount: number;
  createdAt: string;
  status: 'PAID' | 'EXPIRED' | 'PENDING';
}


interface Status {
  value: string,
  viewValue: string
}

@Component({
  selector: 'app-debts',
  imports: [CommonModule, ReactiveFormsModule, ToastModule, ButtonModule, RouterModule],
  templateUrl: './debts.component.html',
  styleUrl: './debts.component.css',
  providers: [MessageService]
})
export class DebtsComponent implements OnInit {

  public myform!: FormGroup
  public formReady: boolean = false
  public showCreateDebtModal: boolean = false;

  public debts: Debt[] | null = null;
  private fullDebts: Debt[] | null = null
  public readyDebts: boolean = false
  public hasPendingDebts: boolean = false;

  public paidCount: number = 0
  public pendingCount: number = 0
  public expiredCount: number = 0

  public paidFilter: boolean = false
  public pendingFilter: boolean = false
  public expiredFilter: boolean = false

  private authSub!: Subscription
  private tokenSub!: Subscription
  public admin: boolean | null = null
  public users: userDebts[] | null = null
  public status: Status[] = [{ value: 'PENDING', viewValue: 'Pendiente' }, { value: 'EXPIRED', viewValue: 'Expirada' }, { value: 'PAID', viewValue: 'Pagada' }]

  constructor(private readonly debtsService: DebtsService, private readonly userService: UserKeyCloakService, private fb: FormBuilder) {
    // this.admin = this.userService.isAdmin()
  }

  ngOnInit(): void {
    this.authSub = this.userService.admin$.subscribe((admin: boolean) => {
      this.admin = admin
      this.tokenSub = this.userService.token$.subscribe((token: string | null) => {
        if (token) {
          this.loadDebts()
        }
      })
    })
  }

  //-------- Mensajes de éxito y error para la creación de productos --------------
  private messageService = inject(MessageService);

  showCreateDebtSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Deuda creada correctamente' });
  }
  showCreateDebtLoadError() {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'No se pudo cargar la información necesaria para el formulario de creación de deudas.' });
  }
  showCreateDebtError() {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al crear la deuda' });
  }
  showPayDebtSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Deuda pagada correctamente' });
  }
  showPayDebtError() {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al pagar la deuda' });
  }
  private async loadDebts() {
    const loadedDebts = await this.debtsService.getDebts();
    this.debts = loadedDebts as Debt[]; // Asegurar el tipado
    this.fullDebts = this.debts
    this.checkPendingDebts(); // Llamar a la función para verificar deudas pendientes
    this.readyDebts = true;

    this.pendingCount = 0
    this.expiredCount = 0
    this.paidCount = 0

    this.debts.forEach(debt => {

      if (debt.status === DebtStatus.PENDING) this.pendingCount++
      if (debt.status === DebtStatus.EXPIRED) this.expiredCount++
      if (debt.status === DebtStatus.PAID) this.paidCount++
    })
  }

  private checkPendingDebts(): void {
    if (this.debts && this.debts.length > 0) {
      this.hasPendingDebts = this.debts.some(debt => debt.status === 'PENDING');
    } else {
      this.hasPendingDebts = false;
    }
  }

  private async loadFormDataIfNeeded() {
    if (this.admin && !this.formReady) { // Solo cargar si es admin y no está listo
      this.users = await this.userService.getAllUsersNames();
      if (this.users) {
        this.myform = this.fb.group({
          users: ['', Validators.required], // user_id se guardará aquí
          description: ['Deuda generada automáticamente', Validators.required], // Añadido campo descripción
          amount: [1000, [Validators.required, Validators.min(1000)]],
          status: ['', Validators.required]
        });
        this.formReady = true;
      } else {
        console.error("No se pudieron cargar los usuarios para el formulario.");
        this.formReady = false; // Asegurar que formReady es false si los usuarios no cargan
      }
    }
  }

  public async toggleCreateDebtModal(show?: boolean): Promise<void> {
    console.log("si lo llama")
    if (!this.admin) return; // Solo los admins pueden abrirlo

    const newShowState = (typeof show === 'boolean') ? show : !this.showCreateDebtModal;

    if (newShowState) {
      // Si se va a mostrar y el form no está listo o no existe, cargarlo.
      if (!this.formReady || !this.myform) {
        await this.loadFormDataIfNeeded();
      }
      // Si después de intentar cargar, el form sigue sin estar listo (ej. fallo al cargar usuarios), no mostrar.
      if (!this.formReady) {
        this.showCreateDebtLoadError();
        this.showCreateDebtModal = false;
        return;
      }
      // Resetear el formulario a sus valores iniciales cada vez que se abre
      if (this.myform) {
        this.myform.reset({
          users: '',
          description: 'Deuda generada automáticamente',
          amount: 1000,
          status: ''
        });
      }
    }
    this.showCreateDebtModal = newShowState;
  }

  public filterBy(status: string) {
    if (!this.fullDebts) return;

    // Alternar el flag correspondiente
    if (status === DebtStatus.EXPIRED) {
      this.expiredFilter = !this.expiredFilter;
    } else if (status === DebtStatus.PAID) {
      this.paidFilter = !this.paidFilter;
    } else if (status === DebtStatus.PENDING) {
      this.pendingFilter = !this.pendingFilter;
    }

    // Armar array de estados activos para filtrar
    const activeFilters: any[] = [];
    if (this.expiredFilter) activeFilters.push(DebtStatus.EXPIRED);
    if (this.paidFilter) activeFilters.push(DebtStatus.PAID);
    if (this.pendingFilter) activeFilters.push(DebtStatus.PENDING);

    // Si no hay filtros activos, mostrar todo
    if (activeFilters.length === 0) {
      this.debts = [...this.fullDebts];
    } else {
      this.debts = this.fullDebts.filter(debt => activeFilters.includes(debt.status));
    }
  }

  async onSubmit() {
    if (!this.myform || !this.myform.valid) {
      console.log('Formulario inválido o no inicializado');
      this.myform?.markAllAsTouched(); // Mostrar errores si el formulario existe
      return;
    }

    const formValues = this.myform.value;
    const payload: DebtDto = {
      user_id: formValues.users, // 'users' control contiene el user_id
      description: formValues.description, // Usar valor del formulario
      amount: formValues.amount,
      status: formValues.status
    };

    const result = await this.debtsService.createNewDebt(payload);
    if (result) { // Asumiendo que createNewDebt devuelve algo en caso de éxito
      this.showCreateDebtSuccess(); // Mostrar mensaje de éxito
      await this.loadDebts(); // Recargar deudas
      this.toggleCreateDebtModal(false); // Cerrar el modal
    } else {
      this.showCreateDebtError();
    }
  }

  public getUserToken() {
    console.log(this.debtsService.getDebts())
  }

  // Nueva función para manejar el pago (implementar la lógica de pago)
  public async pagarDeuda(debtId: string) {
    console.log('Pagar deuda con ID:', debtId);
    try {
      const data: UpdateDebtDto = { id: debtId, status: DebtStatus.PAID }
      const result = await this.debtsService.payDebt(data)
      if (result) {
        this.showPayDebtSuccess();
        this.loadDebts()
      }
    } catch (error) {
      this.showPayDebtError();
      console.error('Error al pagar la deuda:', error);
    }

  }



}