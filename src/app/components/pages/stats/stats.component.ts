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

  session = this.supabase.session

  rank: number;
  stats: any = {played: "", distribution: []};
  username: string = "";

  constructor(private readonly supabase: SupabaseService, private router: Router, private backendService: BackendService) { }

  ngOnInit(): void {

    this.supabase.authChanges((_, session) => (this.session = session))

    if (this.session == null) {
      this.router.navigate(['login']);
    } else {
      this.getProfile()
    }
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
        this.stats = data[0].history
        console.log(this.stats)
        this.getRank()
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
        this.rank = rank[0] + 1

        this.loading = false
      },
      error: error => {
        console.log(error)
      }
    })

  }



}
