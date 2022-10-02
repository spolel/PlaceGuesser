import {
  AfterViewInit,
  Component,
  EventEmitter,
  HostListener,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
})

//Implementing a leaderboard with Angular Material components
export class LeaderboardComponent implements OnInit {
  displayedColumns: string[] = [
    'rank',
    'username',
    'score',
    'multi',
    'basescore',
  ];
  data: any[];
  dataSource;

  paginatorSize: number;

  resultsLength = 0;
  isLoadingResults = true;

  //tracking selected row for highlighting
  selectedRow: any;

  //paths to show on map when selecting score from leaderboard
  paths: any[];
  mapOpen: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatTable) table: MatTable<any>;

  //tracking if we are on a mobile device
  mobile: boolean;
  @HostListener('window:resize', []) onWindowResize() {
    this.isMobile();
    this.refresh();
  }

  @Output() selectedPathsEvent = new EventEmitter();

  constructor(private backendService: BackendService) {}

  ngOnInit(): void {
    this.isMobile();
  }

  ngAfterViewInit() {
    this.backendService.getLeaderboard().subscribe({
      next: (data) => {
        this.data = data;
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoadingResults = false;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openMap(row, paths) {
    this.selectedRow = row;
    this.selectedPathsEvent.emit(paths);
  }

  isMobile() {
    if (window.innerWidth >= 1000) {
      this.mobile = false;
    } else {
      this.mobile = true;
    }
  }

  refresh(){
    if(this.mobile){
      this.paginator.pageSize = 5;
      // this.table.renderRows();
      // this.paginator.nextPage();
      // this.paginator.previousPage();
    }else{
      this.paginator.pageSize = 10;
      // this.table.renderRows();
      // this.paginator.nextPage();
      // this.paginator.previousPage();
    }

  }
}
