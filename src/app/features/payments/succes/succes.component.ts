import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-succes',
  imports: [],
  templateUrl: './succes.component.html',
  styleUrl: './succes.component.css'
})
export class SuccesComponent {

  private router = inject(Router);

  public return () {
    this.router.navigate(['/'])
  }

}
