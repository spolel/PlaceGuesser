import { Component, Input, OnInit, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { getUniqueXDomainValues, NgxChartsModule } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-barchart',
  templateUrl: './barchart.component.html',
  styleUrls: ['./barchart.component.scss']
})
export class BarchartComponent implements OnInit {

  @Input() inputData: any[];
  data: any[];

  // options

  // unidentified is fit to parent
  view: [number,number] = undefined;

  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showGridLines = false;
  showXAxisLabel = false;
  xAxisLabel = 'Category';
  showYAxisLabel = false;
  yAxisLabel = 'Count';

  // yAxisTickFormatting = val => {
  //   return Math.floor(val).toString()
  // }
  yAxisTickFormatting = undefined

  scheme = undefined

  //setting custom colors for each of the histogram bins
  customColors = [{name:"0",value: '#12cde9'},{name:"5k",value: '#00c4f5'},{name:"10k",value: '#00bafd'},{name:"15k",value: '#34aeff'},{name:"20k",value: '#649fff'},
  {name:"25k",value: '#8b8ef6'},{name:"30k",value: '#ad7be5'},{name:"35k",value: '#c865cc'},{name:"40k",value: '#db4dad'},{name:"45k",value: '#e53489'},{name:"50k",value: '#e61e62'}]


  constructor() { 
  }

  ngOnInit(): void {
  }

  ngAfterContentInit(){
    this.data = this.generateBarChartData(this.inputData)
  }

  //binning the scores into the bar chart
  generateBarChartData(history: any[]) {
    let data = [
      { "name": "0", "value": 0 },
      { "name": "5k", "value": 0 },
      { "name": "10k", "value": 0 },
      { "name": "15k", "value": 0 },
      { "name": "20k", "value": 0 },
      { "name": "25k", "value": 0 },
      { "name": "30k", "value": 0 },
      { "name": "35k", "value": 0 },
      { "name": "40k", "value": 0 },
      { "name": "45k", "value": 0 },
      { "name": "50k", "value": 0 }
    ];

    history.forEach(item => {
      data[this.getScoreCategory(item)]["value"] = data[this.getScoreCategory(item)]["value"] + 1
    })

    return data;
  }

  //returning the right column number from the score
  getScoreCategory(score: number) {
    switch (true) {
      case (score >= 50000):
        return 10
      case (score > 45000):
        return 9
      case (score > 40000):
        return 8
      case (score > 35000):
        return 7
      case (score > 30000):
        return 6
      case (score > 25000):
        return 5
      case (score > 20000):
        return 4
      case (score > 15000):
        return 3
      case (score > 10000):
        return 2
      case (score > 5000):
        return 1
      default:
        return 0
    }
  }

  getScoreCategoryBase(score: number) {
    switch (true) {
      case (score >= 5000):
        return 10
      case (score > 4500):
        return 9
      case (score > 4000):
        return 8
      case (score > 3500):
        return 7
      case (score > 3000):
        return 6
      case (score > 2500):
        return 5
      case (score > 2000):
        return 4
      case (score > 1500):
        return 3
      case (score > 1000):
        return 2
      case (score > 500):
        return 1
      default:
        return 0
    }
  }

}
