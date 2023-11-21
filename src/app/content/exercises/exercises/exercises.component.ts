import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from '@app/shared/components/table/table.component';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { ExercisesService, GrammarExercise, GrammarExerciseUpsert } from 'src/http-client';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { TableColumnType, TableConfig } from '@app/shared/types/tableConfig.interface';
import { combineLatest, filter, firstValueFrom } from 'rxjs';

import { selectCurrentExercise, selectDataSource, selectTotalElements } from '../store/reducers';
import { exercisesActions } from '../store/actions';
import { CreateExerciseComponent } from './create-exercise/create-exercise.component';

@Component({
  selector: 'app-exercises',
  standalone: true,
  imports: [CommonModule, TableComponent, MatButtonModule, TranslateModule],
  templateUrl: './exercises.component.html',
  styleUrls: ['./exercises.component.scss'],
})
export class ExercisesComponent implements OnInit {
  service = inject(ExercisesService);
  store = inject(Store);
  dialog = inject(MatDialog);
  displayedColumns: string[] = ['instruction', 'useCase', 'grammar', 'actions'];
  tableConfig: TableConfig[] = [
    { name: 'exercises.table.instruction', value: 'instruction' },
    { name: 'exercises.table.useCase', value: 'useCase' },
    { name: 'exercises.table.grammar', value: 'grammar' },
    {
      name: 'common.table.actions',
      value: 'actions',
      type: TableColumnType.ACTIONS,
      actions: [
        {
          name: 'common.buttons.preview',
          action: (row: GrammarExercise): void =>
            this.store.dispatch(exercisesActions.previewexercise({ exerciseId: row.id as string })),
        },
        {
          name: 'common.buttons.edit',
          action: (row: GrammarExercise): void => void this.editExercise(row.id as string),
        },
        {
          name: 'common.buttons.delete',
          action: (row: GrammarExercise): void =>
            this.store.dispatch(exercisesActions.deleteexercise({ exerciseId: row.id as string })),
          color: 'warn',
        },
      ],
    },
  ];

  data$ = combineLatest({
    dataSource: this.store.select(selectDataSource),
    totalElements: this.store.select(selectTotalElements),
  });

  ngOnInit(): void {
    this.getDecks({ pageIndex: 0, pageSize: 5 });
  }

  getDecks({ pageIndex, pageSize }: { pageIndex: number; pageSize: number }): void {
    this.store.dispatch(exercisesActions.getexercises({ pageIndex, pageSize }));
  }

  createExercise(): void {
    const dialogRef = this.dialog.open(CreateExerciseComponent, {
      width: '500px',
      height: '300px',
    });

    dialogRef
      .afterClosed()
      .pipe(filter((r) => !!r))
      .subscribe((grammarExerciseUpsert: GrammarExerciseUpsert) => {
        this.store.dispatch(exercisesActions.createexercise({ grammarExerciseUpsert }));
      });
  }

  async editExercise(exerciseId: string): Promise<void> {
    this.store.dispatch(exercisesActions.previewexercise({ exerciseId }));
    this.store.dispatch(exercisesActions.getexercise());
    const exercise = await firstValueFrom(this.store.select(selectCurrentExercise).pipe(filter((r) => !!r)));
    const dialogRef = this.dialog.open(CreateExerciseComponent, {
      width: '500px',
      height: '300px',
      data: {
        ...exercise,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(filter((r) => !!r))
      .subscribe((grammarExerciseUpsert: GrammarExerciseUpsert) => {
        this.store.dispatch(exercisesActions.editexercise({ exerciseId, grammarExerciseUpsert }));
      });
  }
}
