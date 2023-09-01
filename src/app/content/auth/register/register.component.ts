import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { RouterLink } from '@angular/router';
import { combineLatest } from 'rxjs';
import { BackendErrorMessagesComponent } from '@app/shared/components/backend-error-messages/backend-error-messages.component';

import { authActions } from './../store/actions';
import { RegisterRequest } from '../auth.types';
import { selectIsSubmitting, selectValidationErrors } from '../store/reducers';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, BackendErrorMessagesComponent],
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
    backendErrors$: this.store.select(selectValidationErrors),
  });

  onSubmit(): void {
    const request: RegisterRequest = {
      user: this.form.getRawValue(),
    };
    this.store.dispatch(authActions.register({ request }));
  }
}
