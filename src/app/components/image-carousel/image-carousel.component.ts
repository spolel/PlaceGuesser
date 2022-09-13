import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-image-carousel',
  templateUrl: './image-carousel.component.html',
  styleUrls: ['./image-carousel.component.scss']
})

//Implementing an image carousel to display the photos of the place
export class ImageCarouselComponent implements OnInit {
  @Input() images: string[] = [];

  @Output() refreshImageUrlsEvent = new EventEmitter();

  @ViewChild('imagesContainer') imagesContainer: ElementRef;

  imagesLength: number;
  displayIdx: number = 0;

  constructor() { }

  ngOnInit(): void {
    this.imagesLength = this.images.length
    if (this.imagesLength > 0){
      this.displayIdx = 0
    }
  }

  ngAfterViewInit(){
  }

  //scrolling to next photo
  next(){
    if (this.displayIdx < this.imagesLength-1)
      this.displayIdx += 1

    this.imagesContainer.nativeElement.children[this.displayIdx].scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
  }

  //scrolling to previous photo
  previous(){
    if (this.displayIdx > 0)
      this.displayIdx -= 1

    this.imagesContainer.nativeElement.children[this.displayIdx].scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })
  }

  //scrollwheel behaviour
  scroll($event){
    this.imagesContainer.nativeElement.scrollLeft += ($event.deltaY * 2)

    this.updateIndex()
  }

  //scrollbar behaviour
  scrollBar(){
    this.updateIndex()
  }
  
  // getting the index of photo in the middle of the screen so that I can update index for carousel forward/backward buttons
  updateIndex(){
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    let dataIndex = document.elementFromPoint(x, y).getAttribute("data-index");
    if(dataIndex != null){
      this.displayIdx = parseInt(dataIndex)
    }
  }

  refreshImageUrls(){
    console.log("ERROOOOOOOOOOOR on imageload")
    this.refreshImageUrlsEvent.emit()
  }

}
