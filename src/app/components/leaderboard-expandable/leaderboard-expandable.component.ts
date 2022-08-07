import { AfterViewInit, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { merge, startWith, switchMap, catchError, map, Observable, of } from 'rxjs';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { BackendService } from 'src/app/services/backend.service';

@Component({
  selector: 'app-leaderboard-expandable',
  templateUrl: './leaderboard-expandable.component.html',
  styleUrls: ['./leaderboard-expandable.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class LeaderboardExpandableComponent implements OnInit {
  data: any[];
  dataSource;
  columnsToDisplay: string[] = ['rank', 'username', 'score', 'multi', 'basescore'];
  dataColumns: string[] = ['username', 'score', 'multi', 'basescore']
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: any | null;


  center: google.maps.LatLng = new google.maps.LatLng(40, -3)
  zoom: number = 2
  options: google.maps.MapOptions = {
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    minZoom: 2,
    fullscreenControl: false,
    streetViewControl: false,
    mapTypeControl: false,
    clickableIcons: false,
    keyboardShortcuts: true
  }

  markerFlag: any = {
    url: "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png",
    // This marker is 20 pixels wide by 32 pixels high.
    size: new google.maps.Size(20, 32),
    // The origin for this image is (0, 0).
    origin: new google.maps.Point(0, 0),
    // The anchor for this image is the base of the flagpole at (0, 32).
    anchor: new google.maps.Point(0, 32),
  };


  resultsLength = 0;
  isLoadingResults = true;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  mobile: boolean;
  @HostListener("window:resize", []) onWindowResize() {
    this.isMobile()
  }

  constructor(private backendService: BackendService) { }

  ngOnInit(): void {
    this.isMobile()
  }

  ngAfterViewInit() {
    this.backendService.getLeaderboard().subscribe({
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

  columnToTitle(column) {
    switch (column) {
      case "rank":
        return "#"
      case "username":
        return "Username"
      case "score":
        return "Score"
      case "multi":
        return "Multi"
      case "basescore":
        return "Base Score"
      default:
        return ""
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  isMobile() {
    if (window.innerWidth >= 1000) {
      this.mobile = false;
    } else {
      this.mobile = true;
    }
  }
}