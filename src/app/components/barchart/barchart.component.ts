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

  customColors = [{name:"0",value: '#12cde9'},{name:"500",value: '#00c4f5'},{name:"1000",value: '#00bafd'},{name:"1500",value: '#34aeff'},{name:"2000",value: '#649fff'},
  {name:"2500",value: '#8b8ef6'},{name:"3000",value: '#ad7be5'},{name:"3500",value: '#c865cc'},{name:"4000",value: '#db4dad'},{name:"4500",value: '#e53489'},{name:"5000",value: '#e61e62'}]


  constructor() { 
  }

  ngOnInit(): void {
  }

  ngAfterContentInit(){
    this.data = this.generateBarChartData(this.inputData)
  }

  generateBarChartData(history: any[]) {
    let data = [
      { "name": "0", "value": 0 },
      { "name": "500", "value": 0 },
      { "name": "1000", "value": 0 },
      { "name": "1500", "value": 0 },
      { "name": "2000", "value": 0 },
      { "name": "2500", "value": 0 },
      { "name": "3000", "value": 0 },
      { "name": "3500", "value": 0 },
      { "name": "4000", "value": 0 },
      { "name": "4500", "value": 0 },
      { "name": "5000", "value": 0 }
    ];

    history.forEach(item => {
      data[this.getScoreCategory(item)]["value"] = data[this.getScoreCategory(item)]["value"] + 1
    })

    return data;
  }

  getScoreCategory(score: number) {
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

  onSelect(event) {
    console.log(event);
  }

}
