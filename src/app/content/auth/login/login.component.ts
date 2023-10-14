import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { combineLatest } from 'rxjs';
import { RouterLink } from '@angular/router';
import { InputComponent } from '@app/shared/components/input/input.component';
import { AccountLogin } from 'src/http-client';

import { authActions } from '../store/actions';
import { selectIsSubmitting } from '../store/reducers';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, InputComponent],
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
  });

  onSubmit(): void {
    const request: AccountLogin = this.form.getRawValue();
    // Every HTTP request should be dispatched as an action
    this.store.dispatch(authActions.login({ request }));
  }
}
