import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Deck, DeckCreateRequest, DecksService } from 'src/http-client';
import { Store } from '@ngrx/store';
import { combineLatest, filter } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { TableColumnType, TableConfig } from '@app/shared/types/tableConfig.interface';
import { TableComponent } from '@app/shared/components/table/table.component';
import { TranslateModule } from '@ngx-translate/core';

import { decksActions } from '../store/actions';
import { selectDataSource, selectTotalElements } from '../store/reducers';
import { CreateDeckComponent } from './create-deck/create-deck.component';

@Component({
  selector: 'app-decks',
  standalone: true,
  imports: [CommonModule, TableComponent, MatButtonModule, TranslateModule],
  templateUrl: './decks.component.html',
  styleUrls: ['./decks.component.scss'],
})
export class DecksComponent implements OnInit {
  service = inject(DecksService);
  store = inject(Store);
  dialog = inject(MatDialog);
  displayedColumns: string[] = ['name', 'language', 'waitingReviews', 'actions'];
  tableConfig: TableConfig[] = [
    { name: 'decks.table.name', value: 'name' },
    { name: 'decks.table.language', value: 'language' },
    { name: 'decks.table.waitingReviews', value: 'waitingReviews' },
    {
      name: 'common.table.actions',
      value: 'actions',
      type: TableColumnType.ACTIONS,
      actions: [
        {
          name: 'common.buttons.preview',
          action: (row: Deck): void => this.setActiveDeck(row),
        },
        {
          name: 'common.buttons.edit',
          action: (row: Deck): void => this.editDeck(row.id as string, row.name as string, row.language as string),
        },
        {
          name: 'common.buttons.delete',
          action: (row: Deck): void => this.store.dispatch(decksActions.deletedeck({ deckId: row.id as string })),
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
    this.store.dispatch(decksActions.getdecks({ pageIndex, pageSize }));
  }

  createDeck(): void {
    const dialogRef = this.dialog.open(CreateDeckComponent, {
      width: '500px',
      height: '300px',
    });

    dialogRef
      .afterClosed()
      .pipe(filter((r) => !!r))
      .subscribe((decksCreateRequest: DeckCreateRequest) => {
        this.store.dispatch(decksActions.createdeck({ decksCreateRequest }));
      });
  }

  editDeck(deckId: string, name: string, language: string): void {
    const dialogRef = this.dialog.open(CreateDeckComponent, {
      width: '500px',
      height: '300px',
      data: {
        name,
        language,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(filter((r) => !!r))
      .subscribe((decksCreateRequest: DeckCreateRequest) => {
        this.store.dispatch(decksActions.editdeck({ deckId, decksCreateRequest }));
      });
  }

  setActiveDeck(deck: Deck): void {
    this.store.dispatch(decksActions.setactivedeck({ deck }));
  }
}
