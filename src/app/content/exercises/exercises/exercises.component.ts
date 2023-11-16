import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from '@app/shared/components/table/table.component';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';
import { ExercisesService, GrammarExercise, GrammarExerciseUpsert } from 'src/http-client';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { TableColumnType, TableConfig } from '@app/shared/types/tableConfig.interface';
import { combineLatest, filter } from 'rxjs';

import { selectDataSource, selectTotalElements } from '../store/reducers';
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
        /* {
          name: 'common.buttons.preview',
          action: (row: Deck): void => this.setActiveDeck(row),
        },
        {
          name: 'common.buttons.edit',
          action: (row: Deck): void => this.editDeck(row.id as string, row.name as string, row.language as string),
        }, */
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
}
