import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-games-viewer',
  templateUrl: './games-viewer.component.html',
  styleUrls: ['./games-viewer.component.scss']
})
export class GamesViewerComponent implements OnInit {

  loading = true

  mapOpen: boolean = false;
  selectedPaths: any[] = [];

  @Input() username: string;

  constructor() { }

  ngOnInit(): void {
  }

  
  openMap(paths){
    this.selectedPaths = paths
    this.mapOpen = true
  }


}
