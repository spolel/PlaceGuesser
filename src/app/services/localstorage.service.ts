import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor() { }

  // getStats() {
  //   if (localStorage.getItem('history') != null) {
  //     this.stats = JSON.parse(localStorage.getItem('history'))
  //   } else {
  //     this.stats = { played: 0, highscore: 0, distribution: [] }
  //   }

  //   this.barChartData = this.stats["distribution"]
  //   this.getRank()

  // }
}
