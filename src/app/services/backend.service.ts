import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor(private httpClient: HttpClient) { }

  getRandomPlace(pop: number, zone: string): Observable<Object> {
    //console.log('https://data.mongodb-api.com/app/data-mwwux/endpoint/get_random_place?pop='+pop+'&zone='+zone)
    return this.httpClient.get('https://data.mongodb-api.com/app/data-mwwux/endpoint/get_random_place?pop=' + pop + '&zone=' + zone, { responseType: "json" });
  }

  getCachedPhotos(goenameid: number): Observable<Object> {
    return this.httpClient.get('https://data.mongodb-api.com/app/data-mwwux/endpoint/get_place_photos?geonameid=' + goenameid, { responseType: "json" });
  }

  savePlacePhotos(body: Object): Observable<any> {
    const headers = { 'content-type': 'application/json' }

    return this.httpClient.post('https://data.mongodb-api.com/app/data-mwwux/endpoint/save_place_photos', body, { 'headers': headers });
  }

  saveScoreToLeaderboard(body: Object): Observable<any> {
    const headers = { 'content-type': 'application/json' }

    return this.httpClient.post('https://data.mongodb-api.com/app/data-mwwux/endpoint/save_score_to_leaderboard', body, { 'headers': headers });
  }

  saveHistoryToDb(username: string, body: Object): Observable<any> {
    const headers = { 'content-type': 'application/json' }

    return this.httpClient.post('https://data.mongodb-api.com/app/data-mwwux/endpoint/save_history?username=' + username, body, { 'headers': headers });
  }

  getRankFromLeaderboard(highscore: number): Observable<any> {
    return this.httpClient.get('https://data.mongodb-api.com/app/data-mwwux/endpoint/get_rank?highscore=' + highscore, { responseType: "json" });
  }

  getHistory(username: string): Observable<any> {
    return this.httpClient.get('https://data.mongodb-api.com/app/data-mwwux/endpoint/get_history?username=' + username, { responseType: "json" });
  }

  getLeaderboard(): Observable<any> {
    return this.httpClient.get('https://data.mongodb-api.com/app/data-mwwux/endpoint/get_leaderboard', { responseType: "json" });
  }
  

}
