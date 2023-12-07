import { combineLatest, tap } from 'rxjs';
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { InputComponent } from '@app/shared/components/input/input.component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { ScheduledGrammarExercise, SubmittedExerciseReviewAnswer } from 'src/http-client';
import { Router } from '@angular/router';

import { selectCurrentExercise, selectCurrentExerciseAnswers } from '../../store/reducers';
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
  fb = inject(FormBuilder);

  formArray = this.fb.array([this.fb.control('', [Validators.required])]);

  data$ = combineLatest({
    exercise: this.store.select(selectCurrentExercise).pipe(
      tap((exercise) => {
        if (!exercise) {
          this.backToExercises();
          return;
        }

        if (!this.isPreview) {
          for (let i = 1; i < ((exercise as ScheduledGrammarExercise).expectedAnswers ?? 1); i++) {
            this.formArray.push(this.fb.control('', [Validators.required]));
          }
        }
      }),
    ),
    exerciseAnswers: this.store.select(selectCurrentExerciseAnswers),
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
      answers: this.formArray.value,
      suspend,
    } as SubmittedExerciseReviewAnswer;

    this.store.dispatch(exercisesActions.submitanswer({ answers }));
  }

  nextExercise(): void {
    this.formArray.reset();
    this.store.dispatch(exercisesActions.startnextexercise());
  }

  backToExercises(): void {
    void this.router.navigate(['/exercises']);
  }
}
