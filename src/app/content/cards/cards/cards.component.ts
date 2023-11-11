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
import { TranslateModule } from '@ngx-translate/core';

import { cardsActions } from '../store/actions';
import { selectDataSource, selectTotalElements } from '../store/reducers';
import { CreateCardsComponent } from './create-cards/create-cards.component';

@Component({
  selector: 'app-cards',
  standalone: true,
  imports: [CommonModule, TableComponent, MatButtonModule, RouterLink, TranslateModule],
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
    { name: 'cards.table.front', value: 'front.content' },
    { name: 'cards.table.back', value: 'back.content' },
    { name: 'cards.table.status', value: 'status' },
    { name: 'cards.table.reviews', value: 'statistics.reviews' },
    { name: 'cards.table.fails', value: 'statistics.fails' },
    {
      name: 'common.table.actions',
      value: 'actions',
      type: TableColumnType.ACTIONS,
      actions: [
        {
          name: 'common.buttons.preview',
          action: (row: Card): void => this.store.dispatch(cardsActions.getcard({ cardId: row.id as string })),
        },
        {
          name: 'common.buttons.edit',
          action: (row: Card): void =>
            this.editCard(
              row.id as string,
              row.front as unknown as CardContentElement,
              row.back as unknown as CardContentElement,
            ),
        },
        {
          name: 'common.buttons.delete',
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
