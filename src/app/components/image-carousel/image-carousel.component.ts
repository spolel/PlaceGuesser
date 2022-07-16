import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-image-carousel',
  templateUrl: './image-carousel.component.html',
  styleUrls: ['./image-carousel.component.scss']
})
export class ImageCarouselComponent implements OnInit {
  @Input() images: string[] = [];

  @ViewChild('imagesContainer') imagesContainer: ElementRef;

  imagesLength: number;
  displayIdx: number;

  constructor() { }

  ngOnInit(): void {
    this.imagesLength = this.images.length
    if (this.imagesLength > 0)
      this.displayIdx = 0
  }

  ngAfterViewInit(){
    //console.log(this.imagesContainer)
  }

  next(){
    if (this.displayIdx < this.imagesLength-1)
      this.displayIdx += 1

    this.imagesContainer.nativeElement.children[this.displayIdx].scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })

    //console.log(this.displayIdx)
  }

  previous(){
    if (this.displayIdx > 0)
      this.displayIdx -= 1

    this.imagesContainer.nativeElement.children[this.displayIdx].scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' })

    //console.log(this.displayIdx)
  }

  scroll($event){
    this.imagesContainer.nativeElement.scrollLeft += ($event.deltaY * 2)

    this.updateIndex()
  }

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
    //console.log(dataIndex)
  }

}
