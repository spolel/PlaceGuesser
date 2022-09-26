import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-image-background',
  templateUrl: './image-background.component.html',
  styleUrls: ['./image-background.component.scss']
})
export class ImageBackgroundComponent implements OnInit {
  //used for the home background photo
  imageId: number;
  backgroundUrl: string;
  backgroundStyle: any;

  constructor() { }

  ngOnInit(): void {
    //setting a random photo for the home background
    this.imageId = Math.floor(Math.random() * 16) + 1;
    this.backgroundUrl = "../../assets/home-backgrounds/" + this.imageId + "-min.jpg"
    this.backgroundStyle = 'linear-gradient(0deg, rgba(0, 0, 0, 0.90), rgba(0, 0, 0, 0.6)), url(' + this.backgroundUrl + ') no-repeat center center fixed'


  }

}
