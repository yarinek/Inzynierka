import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardsService } from 'src/http-client';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { TableConfig } from '@app/shared/types/tableConfig.interface';
import { combineLatest, take } from 'rxjs';
import { selectActiveDeckId } from '@app/content/decks/store/reducers';
import { TableComponent } from '@app/shared/components/table/table.component';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

import { cardsActions } from '../store/actions';
import { selectDataSource } from '../store/reducers';

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
  displayedColumns: string[] = ['front.content', 'back.content', 'status'];
  tableConfig: TableConfig[] = [
    { name: 'Front', value: 'front.content' },
    { name: 'Back', value: 'back.content' },
    { name: 'Status', value: 'status' },
  ];

  storeId$ = this.store.select(selectActiveDeckId);

  data$ = combineLatest({
    dataSource: this.store.select(selectDataSource),
  });

  ngOnInit(): void {
    this.getCards({ pageIndex: 0, pageSize: 5 });
  }

  getCards({ pageIndex, pageSize }: { pageIndex: number; pageSize: number }): void {
    this.storeId$.pipe(take(1)).subscribe((deckId) => {
      if (deckId) {
        this.store.dispatch(cardsActions.getcards({ deckId, pageIndex, pageSize }));
        return;
      }
      void this.router.navigate(['/decks']);
    });
  }

  /* createDeck(): void {
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
  } */
}
