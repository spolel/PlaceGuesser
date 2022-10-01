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

  mapOpen: boolean = false;
  selectedPaths: any[] = [];
  
  constructor(private backendService: BackendService) { }

  ngOnInit(): void {

  }

  openMap(paths){
    this.selectedPaths = paths
    this.mapOpen = true
  }



}
