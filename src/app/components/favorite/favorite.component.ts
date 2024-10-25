import { Component, OnInit } from '@angular/core';
import { CardData } from '../../interface/movie.model';
import { CardComponent } from '../card/card.component';

@Component({
  selector: 'app-favorite',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './favorite.component.html',
  styleUrl: './favorite.component.scss'
})
export class FavoriteComponent implements OnInit {
  favData:CardData[] = [];
  ngOnInit(): void {
    this.favData = JSON.parse(localStorage.getItem('favorite') || '[]');
  }

}
