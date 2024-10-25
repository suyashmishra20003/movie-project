import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Movie } from '../../interface/movie.model';
import { catchError, debounceTime, distinctUntilChanged, filter, of, Subject, switchMap, takeUntil } from 'rxjs';
import { MovieService } from '../../services/movie.service';
import { CommonModule } from '@angular/common';
import { CardComponent } from '../card/card.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-movie-search',
  standalone: true,
  imports: [FormsModule,ReactiveFormsModule,CommonModule,CardComponent,MatProgressSpinnerModule],
  templateUrl: './movie-search.component.html',
  styleUrl: './movie-search.component.scss'
})
export class MovieSearchComponent implements OnInit, OnDestroy {
  searchForm: FormGroup;
  movies: Movie[] = [];
  currentPage = 1;
  totalPages = 0;
  totalResults = 0;
  isLoading = false;
  currentYear = new Date().getFullYear();
  private destroy$ = new Subject<void>();

  constructor(
    public movieService: MovieService,
    private fb: FormBuilder
  ) {
    this.searchForm = this.fb.group({
      title: [''],
      rating: ['', [Validators.min(0), Validators.max(10)]],
      year: ['', [Validators.min(1900), Validators.max(this.currentYear)]]
    });
  }

  ngOnInit() {
    // Subscribe to loading state
    this.movieService.isLoading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => this.isLoading = loading);

    // Set up search with debounce
    this.searchForm.valueChanges.pipe(
      takeUntil(this.destroy$),
      debounceTime(300),
      distinctUntilChanged((prev, curr) => {
        return JSON.stringify(prev) === JSON.stringify(curr);
      }),
      switchMap(formValue => {
        if (!formValue.title && !formValue.rating && !formValue.year) {
          this.movies = [];
          return [];
        }
        this.currentPage = 1;
        
        // Update search parameters in service
        this.movieService.updateSearchParams({
          query: formValue.title,
          minRating: formValue.rating || 0,
          maxRating: 10,
          year: formValue.year?.toString() || ''
        });

        return this.movieService.searchMoviesFromApi(1);
      })
    ).subscribe(response => {
      if (response) {
        this.movies = response.results;
        this.totalPages = response.total_pages;
        this.totalResults = response.total_results;
      }
    });
  }

  loadMore() {
    if (this.currentPage < this.totalPages && !this.isLoading) {
      this.currentPage++;
      const formValue = this.searchForm.value;
      
      // Ensure search parameters are set before loading more
      this.movieService.updateSearchParams({
        query: formValue.title,
        minRating: formValue.rating || 0,
        maxRating: 10,
        year: formValue.year?.toString() || ''
      });

      this.movieService.searchMoviesFromApi(this.currentPage)
        .subscribe(response => {
          if (response) {
            this.movies = [...this.movies, ...response.results];
          }
        });
    }
  }

  get hasMorePages(): boolean {
    return this.currentPage < this.totalPages;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
