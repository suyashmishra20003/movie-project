import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header.component';
import { MovieService } from './services/movie.service';
import { HttpClientModule } from '@angular/common/http';
import { CardComponent } from "./components/card/card.component";
import { Movie } from './interface/movie.model';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MovieSearchComponent } from './components/movie-search/movie-search.component';
import {MatTooltipModule} from '@angular/material/tooltip';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,MovieSearchComponent , CommonModule , HeaderComponent,MatProgressSpinnerModule , HttpClientModule,FormsModule,ReactiveFormsModule, CardComponent,RouterLink, RouterLinkActive
    ,MatIconModule,MatTooltipModule
  ],
  providers: [MovieService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  isFetchingData: boolean = false;
  private debounceTimer: any = null;
  pageCount: number = 1;
  movieData: Movie[] = [];
  searchTerm:string = ''
  isLoading = false;
  showScrollButton: boolean = false;
  
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  constructor(public movieService:MovieService){}
  ngOnInit(): void {
  }

  onScroll(event: Event): void {
    const panel = event.target as HTMLElement;
    const scrollPosition = panel.scrollTop;
    const scrollHeight = panel.scrollHeight;
    const clientHeight = panel.clientHeight;

    // If scrolled to the bottom, show the button
    if (scrollPosition + clientHeight >= scrollHeight - 2150) {
      this.showScrollButton = true;
    } else {
      this.showScrollButton = false;
    }
  }

  // Scroll to the top of the page
  scrollToTop(): void {
    if (this.scrollContainer) {
      this.scrollContainer.nativeElement.scrollTo({
        top: 0,
        behavior: 'smooth'  // Smooth scroll
      });
    }
  }
  
}
