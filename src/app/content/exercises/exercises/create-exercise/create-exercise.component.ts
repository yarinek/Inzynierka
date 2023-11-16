import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from '@app/shared/components/input/input.component';
import { FormArray, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { SelectComponent } from '@app/shared/components/select/select.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { MatIconModule } from '@angular/material/icon';
import { combineLatest, map } from 'rxjs';
import { GrammarListEntry } from 'src/http-client';
import { SelectOptionInterface } from '@app/shared/components/select/select.types';

import { selectGrammarList } from '../../store/reducers';

@Component({
  selector: 'app-create-exercise',
  standalone: true,
  imports: [
    CommonModule,
    InputComponent,
    ReactiveFormsModule,
    MatButtonModule,
    SelectComponent,
    TranslateModule,
    MatIconModule,
    SelectComponent,
  ],
  templateUrl: './create-exercise.component.html',
  styleUrls: ['./create-exercise.component.scss'],
})
export class CreateExerciseComponent {
  dialogRef = inject(MatDialogRef);
  store = inject(Store);
  fb = inject(FormBuilder);

  //dialogData: { name: string; language: string } = inject(MAT_DIALOG_DATA);

  data$ = combineLatest({
    grammarList: this.store.select(selectGrammarList).pipe(
      map((data: GrammarListEntry[]) =>
        data.map(({ grammar, useCases }) => ({
          useCases: useCases?.map((val) => ({ value: val, label: val })),
          value: grammar as string,
          label: grammar as string,
        })),
      ),
    ),
  });

  form = this.fb.group({
    instruction: ['', Validators.required],
    body: ['', Validators.required],
    correctValues: this.fb.array([this.fb.control('', Validators.required)]),
    useCase: ['', Validators.required],
    grammar: ['', Validators.required],
  });

  get correctValues(): FormArray {
    return this.form.get('correctValues') as FormArray;
  }

  /* get isEdit(): boolean {
    return !!this.dialogData;
  } */

  /* ngOnInit(): void {
    this.form.patchValue({ ...this.dialogData });
  } */

  addAnswer(): void {
    this.correctValues.push(this.fb.control('', Validators.required));
  }

  removeAnswer(index: number): void {
    this.correctValues.removeAt(index);
  }

  onConfirm(): void {
    const { correctValues, ...rest } = this.form.getRawValue();
    this.dialogRef.close({ ...rest, answers: [{ correctValues }] });
  }

  onDismiss(): void {
    this.dialogRef.close(false);
  }

  getUseCases(
    data: {
      useCases:
        | {
            value: string;
            label: string;
          }[]
        | undefined;
      value: string;
      label: string;
    }[],
  ): SelectOptionInterface[] {
    return data.find((el) => el.value === this.form.get('grammar')?.value)?.useCases || [];
  }
}
