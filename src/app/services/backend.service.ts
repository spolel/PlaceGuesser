import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  //backendUrl: any = "https://data.mongodb-api.com/app/data-mwwux/endpoint"
  //backendUrl: any = "http://localhost:8080"
  backendUrl: any = "https://placeguesser-api-mrfsd73xma-ew.a.run.app"

  constructor(private httpClient: HttpClient) { }

  getRandomPlace(gameMode: string, pop: number, zone: string, countrycode: string): Observable<Object> {
    if(gameMode == "country"){
      return this.httpClient.get( this.backendUrl + '/get_random_place?pop=' + pop + '&countrycode=' + countrycode, { responseType: "json" });
    }else{
      return this.httpClient.get( this.backendUrl + '/get_random_place?pop=' + pop + '&zone=' + zone, { responseType: "json" });
    }
  }

  getPhotoUrl(photoreference: string): Observable<string> {
    return this.httpClient.get( this.backendUrl + '/get_photo_url?photoreference=' + photoreference, { responseType: "text" });
  }

  getCachedPhotos(goenameid: number): Observable<Object> {
    return this.httpClient.get( this.backendUrl + '/get_place_photos?geonameid=' + goenameid, { responseType: "json" });
  }

  savePlacePhotos(body: Object): Observable<any> {
    const headers = { 'content-type': 'application/json' }

    return this.httpClient.post( this.backendUrl + '/save_place_photos', body, { 'headers': headers });
  }

  saveScoreToLeaderboard(body: Object): Observable<any> {
    const headers = { 'content-type': 'application/json' }

    return this.httpClient.post( this.backendUrl + '/save_score_to_leaderboard', body, { 'headers': headers });
  }

  saveHistoryToDb(username: string, body: Object): Observable<any> {
    const headers = { 'content-type': 'application/json' }

    return this.httpClient.post( this.backendUrl + '/save_history?username=' + username, body, { 'headers': headers });
  }

  getRankFromLeaderboard(highscore: number): Observable<any> {
    //return this.httpClient.get( this.backendUrl + '/get_rank?highscore=' + highscore, { responseType: "json" });
    return this.httpClient.get( this.backendUrl + '/get_rank_from_leaderboard?highscore=' + highscore, { responseType: "json" });
  }

  getHistory(username: string): Observable<any> {
    return this.httpClient.get( this.backendUrl + '/get_history?username=' + username, { responseType: "json" });
  }

  getStats(username: string): Observable<any> {
    return this.httpClient.get( this.backendUrl + '/get_stats?username=' + username, { responseType: "json" });
  }

  getLeaderboard(): Observable<any> {
    return this.httpClient.get( this.backendUrl + '/get_leaderboard', { responseType: "json" });
  }

  getLeaderboardPaged(index: number, size: number): Observable<any> {
    return this.httpClient.get( this.backendUrl + '/get_leaderboard_paged?index=' + index + '&size=' + size, { responseType: "json" });
  }

  getLeaderboardLength(): Observable<any> {
    return this.httpClient.get( this.backendUrl + '/get_leaderboard_length', { responseType: "json" });
  }
  
  getUserGamesPaged(index: number, size: number, username: string): Observable<any> {
    return this.httpClient.get( this.backendUrl + '/get_user_games_paged?index=' + index + '&size=' + size + '&username=' + username , { responseType: "json" });
  }

  getUserGamesLength(username: string): Observable<any> {
    return this.httpClient.get( this.backendUrl + '/get_user_games_length?username='+username, { responseType: "json" });
  }

  usernameExists(username: string): Observable<any> {
    return this.httpClient.get( this.backendUrl + '/username_exists?username=' + username, { responseType: "json" });
  }
  

}
