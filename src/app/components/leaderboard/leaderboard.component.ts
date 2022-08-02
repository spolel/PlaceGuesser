import { HttpClient } from '@angular/common/http';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { merge, startWith, switchMap, catchError,map, Observable, of } from 'rxjs';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit  {
  displayedColumns: string[] = ['rank', 'username', 'score','gamemode','population'];
  data: any[];
  dataSource;

  resultsLength = 0;
  isLoadingResults = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {

  }

  ngAfterViewInit(){
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


  getLeaderboard(): Observable<any> {
    return this.httpClient.get('https://data.mongodb-api.com/app/data-mwwux/endpoint/get_leaderboard', { responseType: "json" });
  }
}