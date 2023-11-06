import { Component, Input, AfterViewInit, ViewChild, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { TableConfig } from '@app/shared/types/tableConfig.interface';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatPaginatorModule, MatButtonModule],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent<T> implements OnInit, AfterViewInit {
  @Input() set dataSource(val: T[]) {
    this._dataSource = new MatTableDataSource<T>(val);
  }

  @Input() displayedColumns: string[] = [];
  @Input() tableConfig: TableConfig[] = [];

  @Output() changePagination = new EventEmitter<{ pageIndex: number; pageSize: number }>();

  _dataSource = new MatTableDataSource<T>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit(): void {
    new MatTableDataSource<T>([]);
  }

  ngAfterViewInit(): void {
    this._dataSource.paginator = this.paginator;
  }

  onChangePage(event: { pageIndex: number; pageSize: number }): void {
    this.changePagination.emit(event);
  }
}
