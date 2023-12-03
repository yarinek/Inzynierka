import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Deck, DeckCreateRequest, DecksService, SharedDeckCreateRequest } from 'src/http-client';
import { Store } from '@ngrx/store';
import { combineLatest, filter } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TableColumnType, TableConfig } from '@app/shared/types/tableConfig.interface';
import { TableComponent } from '@app/shared/components/table/table.component';
import { TranslateModule } from '@ngx-translate/core';
import { Router, RouterLink } from '@angular/router';

import { decksActions } from '../store/actions';
import { selectDataSource, selectTotalElements } from '../store/reducers';
import { CreateDeckComponent } from './create-deck/create-deck.component';

@Component({
  selector: 'app-decks',
  standalone: true,
  imports: [CommonModule, TableComponent, MatButtonModule, TranslateModule, RouterLink, MatDialogModule],
  templateUrl: './decks.component.html',
  styleUrls: ['./decks.component.scss'],
})
export class DecksComponent implements OnInit {
  service = inject(DecksService);
  store = inject(Store);
  dialog = inject(MatDialog);
  router = inject(Router);
  displayedColumns: string[] = ['name', 'language', 'waitingReviews', 'actions'];
  displayedSharedColumns: string[] = ['name', 'language', 'popularity', 'actions'];
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
          name: 'common.buttons.view',
          action: (row: Deck): void => this.setActiveDeck(row),
        },
        {
          name: 'common.buttons.edit',
          action: (row: Deck): void => this.editDeck(row.id as string, row.name as string, row.language as string),
        },
        {
          name: 'common.buttons.delete',
          action: (row: Deck): void => {
            return this.isSharedDeckMode
              ? this.store.dispatch(decksActions.deleteshareddeck({ deckId: row.id as string }))
              : this.store.dispatch(decksActions.deletedeck({ deckId: row.id as string }));
          },
          color: 'warn',
        },
        {
          name: 'common.buttons.createSharedDeck',
          action: (row: Deck): void => this.createDeck(true, row.id as string),
        },
      ],
    },
  ];

  tableConfigShared: TableConfig[] = [
    { name: 'decks.table.name', value: 'name' },
    { name: 'decks.table.language', value: 'language' },
    { name: 'decks.table.popularity', value: 'popularity' },
    {
      name: 'common.table.actions',
      value: 'actions',
      type: TableColumnType.ACTIONS,
      actions: [
        {
          name: 'common.buttons.view',
          action: (row: Deck): void => this.setActiveDeck(row),
        },
        {
          name: 'common.buttons.edit',
          action: (row: Deck): void => this.editDeck(row.id as string, row.name as string, row.language as string),
        },
        {
          name: 'common.buttons.delete',
          action: (row: Deck): void => {
            return this.isSharedDeckMode
              ? this.store.dispatch(decksActions.deleteshareddeck({ deckId: row.id as string }))
              : this.store.dispatch(decksActions.deletedeck({ deckId: row.id as string }));
          },
          color: 'warn',
        },
      ],
    },
  ];

  data$ = combineLatest({
    dataSource: this.store.select(selectDataSource),
    totalElements: this.store.select(selectTotalElements),
  });

  get isSharedDeckMode(): boolean {
    return this.router.url.includes('shared');
  }

  ngOnInit(): void {
    this.store.dispatch(decksActions.getallshareddecks());
    this.getDecks({ pageIndex: 0, pageSize: 5 });
  }

  getDecks({ pageIndex, pageSize }: { pageIndex: number; pageSize: number }): void {
    this.isSharedDeckMode
      ? this.store.dispatch(decksActions.getshareddecks({ pageIndex, pageSize }))
      : this.store.dispatch(decksActions.getdecks({ pageIndex, pageSize }));
  }

  createDeck(shared = false, deckId?: string): void {
    const dialogRef = this.dialog.open(CreateDeckComponent, {
      width: '100vw',
      minHeight: '40vh',
      data: {
        shared,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(filter((r) => !!r))
      .subscribe((decksCreateRequest: DeckCreateRequest) => {
        shared && deckId
          ? this.store.dispatch(
              decksActions.createshareddeck({
                decksCreateRequest: { ...decksCreateRequest, deckId: deckId },
              }),
            )
          : this.store.dispatch(decksActions.createdeck({ decksCreateRequest }));
      });
  }

  editDeck(deckId: string, name: string, language: string): void {
    const shared = this.router.url.includes('shared');
    const dialogRef = this.dialog.open(CreateDeckComponent, {
      width: '100vw',
      height: '80vh',
      data: {
        name,
        language,
        shared,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(filter((r) => !!r))
      .subscribe((decksCreateRequest: DeckCreateRequest | SharedDeckCreateRequest) => {
        shared
          ? this.store.dispatch(
              decksActions.editshareddeck({
                deckId,
                decksCreateRequest: decksCreateRequest as SharedDeckCreateRequest,
              }),
            )
          : this.store.dispatch(decksActions.editdeck({ deckId, decksCreateRequest }));
      });
  }

  setActiveDeck(deck: Deck): void {
    this.isSharedDeckMode
      ? this.store.dispatch(decksActions.setactiveshareddeck({ deck }))
      : this.store.dispatch(decksActions.setactivedeck({ deck }));
  }

  navigateToSharedDecks(): void {
    void this.router.navigate(['decks/shared']);
  }
}
