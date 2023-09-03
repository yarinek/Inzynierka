import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { RouterLink } from '@angular/router';
import { BackendErrorMessagesComponent } from '@app/shared/components/backend-error-messages/backend-error-messages.component';
import { InputComponent } from '@app/shared/components/input/input.component';

import { authActions } from '../store/actions';
import { LoginRequest } from '../auth.types';
import { selectIsSubmitting, selectValidationErrors } from '../store/reducers';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, BackendErrorMessagesComponent, InputComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private store = inject(Store);
  protected form = this.fb.nonNullable.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  data$ = combineLatest({
    isSubmitting$: this.store.select(selectIsSubmitting),
    backendErrors$: this.store.select(selectValidationErrors),
  });

  onSubmit(): void {
    const request: LoginRequest = {
      user: this.form.getRawValue(),
    };
    this.store.dispatch(authActions.login({ request }));
  }
}
