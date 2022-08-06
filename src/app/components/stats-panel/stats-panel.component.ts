import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-stats-panel',
  templateUrl: './stats-panel.component.html',
  styleUrls: ['./stats-panel.component.scss']
})
export class StatsPanelComponent implements OnInit {

  @Input() stats: any = {}
  @Input() barChartData: any[] = []
  @Input() rank: number;
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
