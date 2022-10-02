import {
  OnInit,
  AfterViewInit,
  Component,
  EventEmitter,
  HostListener,
  Output,
  ViewChild,
  Input,
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin, mergeMap } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';
@Component({
  selector: 'app-user-games-paged',
  templateUrl: './user-games-paged.component.html',
  styleUrls: ['./user-games-paged.component.scss']
})

export class UserGamesPagedComponent implements OnInit {
  displayedColumns: string[] = [
    'rank',
    'score',
    'multi',
    'basescore',
    'mode'
  ];
  dataSource = new MatTableDataSource();

  data: any;
  length: number = 0;
  isLoadingResults: boolean = true;

  logging: boolean = false;

  //tracking selected row for highlighting
  selectedRow: any;

  //paths to show on map when selecting score from leaderboard
  paths: any[];
  mapOpen: boolean = false;

  pageSize: number;

  @Input() username: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Output() selectedPathsEvent = new EventEmitter();

  //tracking if we are on a mobile device
  mobile: boolean;
  @HostListener('window:resize', []) onWindowResize() {
    this.isMobile();
  }

  constructor(private backend: BackendService) {}

  ngOnInit(): void {
    this.isMobile();
    if (this.mobile) {
      this.pageSize = 5;
    } else {
      this.pageSize = 10;
    }
  }

  ngAfterViewInit() {
    this.isLoadingResults = true;
    //get total number of entries in the leaderboard to set the total size of paginator
    this.backend.getUserGamesLength(this.username).subscribe({
      next: (length) => {
        if (this.logging) {
          console.log(length[0]);
        }
        this.length = length[0];
      },
      error: (error) => {
        console.log(error);
      },
    });

    //load first blocks
    this.backend
      .getUserGamesPaged(0, this.pageSize, this.username)
      .pipe
      //for each block I am getting the transaction number and adding to to that block
      // mergeMap(blocks => forkJoin(
      //   blocks.map(block =>
      //     //calls to the api to get the transaction number from that level
      //     this.tzkt.getTransactionCount(block.level).pipe(
      //       map(transactions => ({
      //         ...block,
      //         transactions: transactions
      //       }))
      //     )
      //   )
      // ))
      ()
      .subscribe({
        next: (data) => {
          if (this.logging) {
            console.log(data);
          }
          this.data = data;
          this.dataSource = new MatTableDataSource(this.data);
          this.isLoadingResults = false;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  //on page event load new blocks based on page index and size
  getNextBlocks(event: PageEvent) {
    this.isLoadingResults = true;

    this.backend
      .getUserGamesPaged(event.pageIndex, event.pageSize, this.username)
      .pipe
      //for each block I am getting the transaction number and adding to to that block
      // mergeMap(blocks => forkJoin(
      //   blocks.map(block =>
      //     //calls to the api to get the transaction number from that level
      //     this.tzkt.getTransactionCount(block.level).pipe(
      //       map(transactions => ({
      //         ...block,
      //         transactions: transactions
      //       }))
      //     )
      //   )
      // ))
      ()
      .subscribe({
        next: (data) => {
          if (this.logging) {
            console.log(data);
          }
          this.data = data;
          this.dataSource.data = this.data;
          this.isLoadingResults = false;
        },
        error: (error) => {
          console.log(error);
        },
      });
    return event;
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
}
