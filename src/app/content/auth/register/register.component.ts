import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { RouterLink } from '@angular/router';
import { combineLatest } from 'rxjs';
import { InputComponent } from '@app/shared/components/input/input.component';
import { SelectComponent } from '@app/shared/components/select/select.component';
import { AccountRegistration } from 'src/http-client';

import { authActions } from './../store/actions';
import { selectIsSubmitting } from '../store/reducers';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, InputComponent, SelectComponent],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  protected form = this.fb.nonNullable.group({
    username: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  data$ = combineLatest({
    isSubmitting$: this.store.select(selectIsSubmitting),
  });

  onSubmit(): void {
    const request: AccountRegistration = this.form.getRawValue();
    // Every HTTP request should be dispatched as an action
    this.store.dispatch(authActions.register({ request }));
  }
}
