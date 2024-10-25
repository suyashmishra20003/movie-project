import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MovieService } from '../../services/movie.service';
import { CardData } from '../../interface/movie.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [MatIconModule,CommonModule,MatTooltipModule],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss'
})
export class CardComponent implements OnChanges,OnInit {
  @Input() title: string = '';
  @Input() imagePath :string = '';
  @Input() releaseYear: string = '';
  @Input() rating: number = 0;
  @Input() cardIndex: number = 0;
  @Input() cardId: number = 0;
  
  imagePathUrl: string = '';
  currIcon:string = ''
  isFavorite:boolean = false
  currentObj:CardData = {
    title: '',
      imagePath: '',
      releaseYear: '',
      rating: 0,
      id:0
  }

  currentRoute:string = ''
  currIndex:number = 0
  deleteCard:boolean = false
  constructor(private movieService:MovieService,
    private activeRoute:ActivatedRoute
  ){
    this.activeRoute.url.subscribe((res) => {
      let strArr = res[0].path.split('/')
      this.currentRoute = strArr[strArr.length - 1]
    })
  }
  ngOnInit(): void {

  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['imagePath']) {
      this.imagePathUrl = this.movieService.getPosterUrl(this.imagePath);
    }

    this.currentObj = {
      title: this.title,
      imagePath: this.imagePath,
      releaseYear: this.releaseYear,
      rating: this.rating,
      id:this.cardId
    }

    this.currIndex = this.cardIndex
  }

  addToFavorite(){
    this.isFavorite = !this.isFavorite
    let favArr = this.movieService.favouriteData
    if (this.isFavorite) {
      let present  = false
      favArr.forEach((element:any) => {
        if(element.title == this.currentObj.title){
          present = true
        }
      })
  
      if(present){
        return
      }
      favArr.push(this.currentObj)
      localStorage.setItem('favorite',JSON.stringify(favArr))
    }else{
      let index = 0
      favArr.map((item:CardData,i) => {
        if (item.title == this.currentObj.title) {
          index = i
        }
      })

      favArr.splice(index,1)
      localStorage.setItem('favorite',JSON.stringify(favArr))

    }
    console.log(favArr)
  }

  deleteFromFavorite(){
    let favArr = this.movieService.favouriteData
    favArr.splice(this.currIndex,1)
    localStorage.setItem('favorite',JSON.stringify(favArr))
    console.log(favArr)
    this.deleteCard = true
  }

}
