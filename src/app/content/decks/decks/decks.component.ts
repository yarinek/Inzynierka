import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeckCreateRequest, DecksService } from 'src/http-client';
import { Store } from '@ngrx/store';
import { combineLatest, filter } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { TableConfig } from '@app/shared/types/tableConfig.interface';
import { TableComponent } from '@app/shared/components/table/table.component';

import { decksActions } from '../store/actions';
import { selectDataSource } from '../store/reducers';
import { CreateDeckComponent } from './create-deck/create-deck.component';

@Component({
  selector: 'app-decks',
  standalone: true,
  imports: [CommonModule, TableComponent, MatButtonModule],
  templateUrl: './decks.component.html',
  styleUrls: ['./decks.component.scss'],
})
export class DecksComponent implements OnInit {
  service = inject(DecksService);
  store = inject(Store);
  dialog = inject(MatDialog);
  displayedColumns: string[] = ['name', 'language', 'waitingReviews'];
  tableConfig: TableConfig[] = [
    { name: 'Name', value: 'name' },
    { name: 'Language', value: 'language' },
    { name: 'Waiting reviews', value: 'waitingReviews' },
  ];

  data$ = combineLatest({
    dataSource: this.store.select(selectDataSource),
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

  setActiveDeck(deckId: string): void {
    this.store.dispatch(decksActions.setactivedeck({ deckId }));
  }
}
