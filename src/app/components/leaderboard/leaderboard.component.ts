import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { merge, startWith, switchMap, catchError, map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {
  displayedColumns: string[] = ['rank', 'username', 'score', 'multi', 'basescore'];
  data: any[];
  dataSource;

  clickedRows = new Set<any>();

  resultsLength = 0;
  isLoadingResults = true;

  paths: any[];
  mapOpen: boolean = false;

  highlightedRows: any[] = [];
  selectedRow: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  mobile: boolean;
  @HostListener("window:resize", []) onWindowResize() {
    this.isMobile()
  }


  @Output() selectedPathsEvent = new EventEmitter();

  constructor(private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.isMobile()
  }

  ngAfterViewInit() {
    this.getLeaderboard().subscribe({
      next: data => {
        this.data = data
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoadingResults = false
      },
      error: error => {
        console.log(error)
      }
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openMap(row, paths) {
    this.selectedRow = row
    this.selectedPathsEvent.emit(paths)
  }

  getLeaderboard(): Observable<any> {
    return this.httpClient.get('https://data.mongodb-api.com/app/data-mwwux/endpoint/get_leaderboard', { responseType: "json" });
  }

  isMobile() {
    if (window.innerWidth >= 1000) {
      this.mobile = false;
    } else {
      this.mobile = true;
    }
  }
}