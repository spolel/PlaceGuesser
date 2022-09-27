import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BackendService } from 'src/app/services/backend.service';
import { Profile, SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {

  loading = true
  profile: Profile | undefined

  rank: number;
  stats: any = {highscore: "0", played: "0", distribution: []};
  username: string = "";

  constructor(private readonly supabase: SupabaseService, private router: Router, private backendService: BackendService) { }

  ngOnInit(): void {

    this.getProfile()
  }

  async getProfile() {
    try {
      this.loading = true
      let { data: profile, error, status } = await this.supabase.profile

      if (error && status !== 406) {
        throw error
      }

      if (profile) {
        this.profile = profile
        this.username = profile.username
      }
    } catch (error) {
      console.log(error.message)
    } finally {
      this.getHistory()
    }
  }

  getHistory(){
    this.backendService.getHistory(this.profile.username).subscribe({
      next: data => {
        console.log(data)
        if(data.length == 0){
          this.loading = false
        }else{
          this.stats = data[0].history
          this.getRank()
        }
      },
      error: error => {
        console.log(error)
      }
    })
  }

  //gets you current highscore ranking in the global leaderboard from the db
  getRank() {
    this.backendService.getRankFromLeaderboard(parseInt(this.stats["highscore"])).subscribe({
      next: rank => {
        if(rank.length > 0){
          this.rank = rank[0] + 1
        }else{
          this.rank = undefined
        }
        

        this.loading = false
      },
      error: error => {
        console.log(error)
      }
    })

  }



}
