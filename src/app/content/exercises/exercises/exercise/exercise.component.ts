import { combineLatest, tap } from 'rxjs';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { InputComponent } from '@app/shared/components/input/input.component';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { SubmittedExerciseReviewAnswer } from 'src/http-client';
import { Router } from '@angular/router';

import { selectCurrentExercise } from '../../store/reducers';
import { exercisesActions } from '../../store/actions';

@Component({
  selector: 'app-exercise',
  standalone: true,
  imports: [CommonModule, InputComponent, ReactiveFormsModule, TranslateModule, MatButtonModule],
  templateUrl: './exercise.component.html',
  styleUrls: ['./exercise.component.scss'],
})
export class ExerciseComponent implements OnInit {
  store = inject(Store);
  router = inject(Router);
  answer = new FormControl('', [Validators.required]);

  data$ = combineLatest({
    exercise: this.store.select(selectCurrentExercise).pipe(
      tap((exercise) => {
        if (!exercise) this.backToExercises();
      }),
    ),
  });

  get isPreview(): boolean {
    return this.router.url.includes('preview');
  }

  ngOnInit(): void {
    if (this.isPreview) {
      this.store.dispatch(exercisesActions.getexercise());
    }
  }

  saveAnswer(suspend = false): void {
    const answers = {
      answers: [this.answer.value],
      suspend,
    } as SubmittedExerciseReviewAnswer;
    this.answer.reset();
    this.store.dispatch(exercisesActions.submitanswer({ answers }));
  }

  backToExercises(): void {
    void this.router.navigate(['/exercises']);
  }
}
