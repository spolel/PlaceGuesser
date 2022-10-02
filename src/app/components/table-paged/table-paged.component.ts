import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin, mergeMap } from 'rxjs';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-table-paged',
  templateUrl: './table-paged.component.html',
  styleUrls: ['./table-paged.component.scss']
})
export class TablePagedComponent implements AfterViewInit  {
  displayedColumns: string[] = ['rank', 'username', 'score', 'multi', 'gamemode', 'population'];
  dataSource = new MatTableDataSource;

  data: any;
  length: number = 0;
  isLoadingResults: boolean = true;

  logging: boolean = false;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private backend: BackendService) { }

  ngAfterViewInit(): void {
    this.isLoadingResults = true
    //get total number of entries in the leaderboard to set the total size of paginator
    this.backend.getLeaderboardLength().subscribe({
      next: length => {
        if (this.logging) { console.log(length[0]) }
        this.length = length[0]
      },
      error: error => {
        console.log(error)
      }
    })

    //load first blocks
    this.backend.getLeaderboardPaged(0, 10).pipe(
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
    ).subscribe({
      next: data => {
        if (this.logging) { console.log(data) }
        this.data = data
        this.dataSource = new MatTableDataSource(this.data)
        this.isLoadingResults = false
      },
      error: error => {
        console.log(error)
      }
    })
  }

  //on page event load new blocks based on page index and size
  getNextBlocks(event: PageEvent) {
    this.isLoadingResults = true

    this.backend.getLeaderboardPaged(event.pageIndex, event.pageSize).pipe(
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
    ).subscribe({
      next: data => {
        if (this.logging) { console.log(data) }
        this.data = data
        this.dataSource.data = this.data
        this.isLoadingResults = false
      },
      error: error => {
        console.log(error)
      }
    })
    return event
  }

  openDetails(row) {
    console.log(row.level)
  }
}
