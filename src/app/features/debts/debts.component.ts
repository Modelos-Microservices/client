import { Component, OnInit } from '@angular/core';
import { DebtsService } from '../../core/services/debts.service';
import { UserKeyCloakService } from '../../core/services/user-key-cloak.service';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DebtDto, userDebts } from '../../core/entities/user.entitie';
import { CommonModule } from '@angular/common';
import { Debt } from '../../core/entities/debt.entitie';

interface Status {
  value : string,
  viewValue : string
}

@Component({
  selector: 'app-debts',
  imports: [ CommonModule,ReactiveFormsModule],
  templateUrl: './debts.component.html',
  styleUrl: './debts.component.css'
})
export class DebtsComponent implements OnInit {

  public myform!: FormGroup
  public formReady: boolean = false

  public debts: any[] | null = null
  public readyDebts : boolean = false

  private authSub!: Subscription
  public admin: boolean | null = null
  public users: userDebts[] | null = null
  public status: Status [] = [{value: 'PENDING', viewValue: 'Pendiente'}, {value: 'EXPIRED', viewValue: 'Expirada'}, {value: 'PAID', viewValue: 'Pagada'}]
  
  constructor(private readonly debtsService: DebtsService, private readonly userService: UserKeyCloakService, private fb: FormBuilder) {
    this.admin = this.userService.isAdmin()
   
  }

  ngOnInit(): void {
    // Nos suscribimos al observable isLoggedIn$
    this.authSub = this.userService.admin$.subscribe((admin: boolean) => {
      this.admin = admin
      if(this.admin){
        this.loadForm()
      }

      this.loadDebts()

    });
  }

  private async loadDebts () {
   this.debts = await this.debtsService.getDebts()
   this.readyDebts = true
   console.log(this.debts)
  }

  private async loadForm () {
    this.users = await this.userService.getAllUsersNames()
    console.log(this.users)
    if(this.users){
      this.myform = this.fb.group({
        users: ['', Validators.required],
        status: ['', Validators.required],
        amount: [1000, [Validators.required, Validators.min(1000)]]
      })
      this.formReady = true
    }
  }

  async onSubmit() {
    if(this.myform.valid){
      // Para acceder a valores individuales, puedes hacer lo siguiente:
      const formValues = this.myform.value;
      const selectedUser = formValues.users;
      const selectedStatus = formValues.status;
      const amount = formValues.amount;

      const payload:DebtDto = {user_id: selectedUser, description: 'ejemplo de deuda', amount:amount, status: selectedStatus } 
      const result = await this.debtsService.createNewDebt(payload)
    } else {
      console.log('Formulario inválido');
    }
  }

  public getUserToken() {
    console.log(this.debtsService.getDebts())
  }

}
