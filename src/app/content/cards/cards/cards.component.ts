import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Card, CardContentElement, CardCreateRequest, CardsService } from 'src/http-client';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { TableColumnType, TableConfig } from '@app/shared/types/tableConfig.interface';
import { combineLatest, filter, map } from 'rxjs';
import { selectActiveDeck } from '@app/content/decks/store/reducers';
import { TableComponent } from '@app/shared/components/table/table.component';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';

import { cardsActions } from '../store/actions';
import { selectDataSource, selectTotalElements } from '../store/reducers';
import { CreateCardsComponent } from './create-cards/create-cards.component';

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [CommonModule, TableComponent, MatButtonModule, RouterLink],
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
          action: (row: Card): void => this.store.dispatch(cardsActions.getcard({ cardId: row.id as string })),
        },
        {
          name: 'Edit',
          action: (row: Card): void =>
            this.editCard(
              row.id as string,
              row.front as unknown as CardContentElement,
              row.back as unknown as CardContentElement,
            ),
        },
        {
          name: 'Delete',
          action: (row: Card): void => this.store.dispatch(cardsActions.deletecard({ cardId: row.id as string })),
          color: 'warn',
        },
      ],
    },
  ];

  data$ = combineLatest({
    dataSource: this.store
      .select(selectDataSource)
      .pipe(map((cards) => cards.map((card) => ({ ...card, front: card?.front![0], back: card?.back![0] })))),
    totalElements: this.store.select(selectTotalElements),
    activeDeck: this.store.select(selectActiveDeck),
  });

  ngOnInit(): void {
    this.getCards({ pageIndex: 0, pageSize: 5 });
  }

  getCards({ pageIndex, pageSize }: { pageIndex: number; pageSize: number }): void {
    this.store.dispatch(cardsActions.getcards({ pageIndex, pageSize }));
  }

  createCard(): void {
    const dialogRef = this.dialog.open(CreateCardsComponent, {
      width: '500px',
      height: '300px',
    });

    dialogRef
      .afterClosed()
      .pipe(filter((r) => !!r))
      .subscribe((cardCreateRequest: CardCreateRequest) => {
        this.store.dispatch(cardsActions.createcard({ cardCreateRequest }));
      });
  }

  editCard(cardId: string, front?: CardContentElement, back?: CardContentElement): void {
    const dialogRef = this.dialog.open(CreateCardsComponent, {
      width: '500px',
      height: '300px',
      data: {
        front: front?.content,
        back: back?.content,
      },
    });

    dialogRef
      .afterClosed()
      .pipe(filter((r) => !!r))
      .subscribe((cardUpdateRequest: CardCreateRequest) => {
        this.store.dispatch(cardsActions.editcard({ cardId, cardUpdateRequest }));
      });
  }

  startActivity(): void {
    this.store.dispatch(cardsActions.startactivity());
  }
}
