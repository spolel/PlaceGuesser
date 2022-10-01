import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BackendService } from 'src/app/services/backend.service';
import { SupabaseService } from 'src/app/services/supabase.service';

@Component({
  selector: 'app-profile-stats',
  templateUrl: './profile-stats.component.html',
  styleUrls: ['./profile-stats.component.scss'],
})
export class ProfileStatsComponent implements OnInit {
  _avatarUrl: SafeResourceUrl | undefined;
  loading: boolean = true;
  stats: any;

  @Input() username: string;

  @Input()
  set avatarUrl(url: string | undefined) {
    if (url) {
      this.downloadImage(url);
    }
  }

  constructor(
    private readonly supabase: SupabaseService,
    private readonly dom: DomSanitizer,
    private backendService: BackendService
  ) {}

  ngOnInit(): void {
    this.getStats();
  }

  getStats() {
    this.backendService.getStats(this.username).subscribe({
      next: (stats) => {
        this.stats = stats;
        this.loading = false;
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  async downloadImage(path: string) {
    try {
      const { data } = await this.supabase.downLoadImage(path);
      if (data instanceof Blob) {
        this._avatarUrl = this.dom.bypassSecurityTrustResourceUrl(
          URL.createObjectURL(data)
        );
      }
    } catch (error) {
      console.error('Error downloading image: ', error.message);
    }
  }
}
