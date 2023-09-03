import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { fromEvent, takeUntil, Observable, map } from 'rxjs';
import { UtilsService } from '@app/core/utils.service';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements OnInit {
  private destroy$ = UtilsService.unsubscribe();
  protected showLoader = false;

  ngOnInit(): void {
    const loaderEvent$: Observable<boolean> = fromEvent<CustomEvent>(window, 'loader').pipe(
      takeUntil(this.destroy$),
      map(({ detail }) => !!detail),
    );

    loaderEvent$.subscribe((showLoader: boolean) => (this.showLoader = showLoader));
  }
}
