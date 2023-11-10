import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Card, CardCreateRequest, CardsService } from 'src/http-client';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { TableColumnType, TableConfig } from '@app/shared/types/tableConfig.interface';
import { combineLatest, filter, map, take } from 'rxjs';
import { selectActiveDeckId } from '@app/content/decks/store/reducers';
import { TableComponent } from '@app/shared/components/table/table.component';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

import { cardsActions } from '../store/actions';
import { selectDataSource, selectTotalElements } from '../store/reducers';
import { CreateCardsComponent } from './create-cards/create-cards.component';

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [CommonModule, TableComponent, MatButtonModule],
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss'],
})
export class CardsComponent implements OnInit {
  service = inject(CardsService);
  store = inject(Store);
  dialog = inject(MatDialog);
  router = inject(Router);
  displayedColumns: string[] = [
    'front.content',
    'back.content',
    'status',
    'statistics.reviews',
    'statistics.fails',
    'actions',
  ];

  tableConfig: TableConfig[] = [
    { name: 'Front', value: 'front.content' },
    { name: 'Back', value: 'back.content' },
    { name: 'Status', value: 'status' },
    { name: 'Reviews', value: 'statistics.reviews' },
    { name: 'Fails', value: 'statistics.fails' },
    {
      name: 'Actions',
      value: 'actions',
      type: TableColumnType.ACTIONS,
      actions: [
        {
          name: 'Preview',
          action: (row: Card): void =>
            this.store.dispatch(cardsActions.getcard({ deckId: this.deckId, cardId: row.id as string })),
        },
        {
          name: 'Delete',
          action: (row: Card): void => this.store.dispatch(cardsActions.deletecard({ cardId: row.id as string })),
          color: 'warn',
        },
      ],
    },
  ];

  deckId = '';

  storeId$ = this.store.select(selectActiveDeckId);

  data$ = combineLatest({
    dataSource: this.store
      .select(selectDataSource)
      .pipe(map((cards) => cards.map((card) => ({ ...card, front: card?.front![0], back: card?.back![0] })))),
    totalElements: this.store.select(selectTotalElements),
  });

  ngOnInit(): void {
    this.getCards({ pageIndex: 0, pageSize: 5 });
  }

  getCards({ pageIndex, pageSize }: { pageIndex: number; pageSize: number }): void {
    this.storeId$.pipe(take(1)).subscribe((deckId) => {
      if (deckId) {
        this.deckId = deckId;
        this.store.dispatch(cardsActions.getcards({ deckId, pageIndex, pageSize }));
        return;
      }
      void this.router.navigate(['/decks']);
    });
  }

  createCard(): void {
    const dialogRef = this.dialog.open(CreateCardsComponent, {
      width: '500px',
      height: '300px',
    });

    dialogRef
      .afterClosed()
      .pipe(filter((r) => !!r))
      .subscribe((decksCreateRequest: CardCreateRequest) => {
        this.store.dispatch(cardsActions.createcard({ deckId: this.deckId, decksCreateRequest }));
      });
  }

  startActivity(): void {
    this.store.dispatch(cardsActions.startactivity({ deckId: this.deckId }));
  }
}
