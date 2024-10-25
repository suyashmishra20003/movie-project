import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import { MovieService } from '../../services/movie.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatIconModule,CommonModule,MatTooltipModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isDarkMode = true;
  showFavorite = false;
  constructor(private movieService:MovieService,
    private router:Router
  ){}
  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      document.body.classList.add('dark'); // Add dark class
    } else {
      document.body.classList.remove('dark'); // Remove dark class
    }
  }

  routeTemplateHandler(){
    this.showFavorite = !this.showFavorite

    if(this.showFavorite){
      this.router.navigate(['/favorites']);
    } else {  
      this.router.navigate(['/search']);
    }
  }
}
