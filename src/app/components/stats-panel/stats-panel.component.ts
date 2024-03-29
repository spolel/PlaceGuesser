import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-stats-panel',
  templateUrl: './stats-panel.component.html',
  styleUrls: ['./stats-panel.component.scss']
})
//implements panel with stats about the user
export class StatsPanelComponent implements OnInit {

  @Input() stats: any = {}
  @Input() username: string;

  mapOpen: boolean = false;
  selectedPaths: any[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  openMap(paths){
    this.selectedPaths = paths
    this.mapOpen = true
  }

}
