import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { CardData, Movie } from '../interface/movie.model';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiKey = 'ba0c8b50b3b6cb9d27b5794c56a8f8f0';
  private baseUrl = 'https://api.themoviedb.org/3';
  private imageBaseUrl = 'https://image.tmdb.org/t/p/w500';

  movieData: Movie[] = []
  totalPages: number = 0
  originalMovieData: Movie[] = []
  // BehaviorSubject to manage loading state
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoadingSubject.asObservable();

  // BehaviorSubject to manage search results
  private searchResultsSubject = new BehaviorSubject<Movie[]>([]);
  searchResults$ = this.searchResultsSubject.asObservable();

  searchParams = {
    query: '',
    minRating: 0,
    maxRating: 10,
    year: ''
  };

  favouriteData: CardData[] = []
  constructor(private http: HttpClient) { }



  getPosterUrl(posterPath: string | null): string {
    if (!posterPath) {
      return 'assets/images/no-poster.jpg'; // Your fallback image
    }
    return `${this.imageBaseUrl}${posterPath}`;
  }


  searchMoviesFromApi(page: number = 1): Observable<any> {
    this.isLoadingSubject.next(true);

    // If there's no query but there are filters, use discover endpoint
    const endpoint = this.searchParams.query
      ? `${this.baseUrl}/search/movie`
      : `${this.baseUrl}/discover/movie`;

    return this.http.get<any>(endpoint, {
      params: this.getParams(page)
    }).pipe(
      map(response => {
        const parsedMovies = response.results
          .map((movie: any) => ({
            id: movie.id,
            title: movie.title,
            description: movie.overview,
            poster_path: movie.poster_path,
            rating: movie.vote_average,
            year: movie.release_date?.split('-')[0] || 'N/A'
          }))
          .filter((movie: Movie) => this.filterMovie(movie));

        // Update the search results subject
        if (page === 1) {
          this.searchResultsSubject.next(parsedMovies);
        } else {
          const currentMovies = this.searchResultsSubject.getValue();
          this.searchResultsSubject.next([...currentMovies, ...parsedMovies]);
        }

        this.isLoadingSubject.next(false);

        return {
          results: parsedMovies,
          total_pages: response.total_pages,
          total_results: response.total_results,
          page: response.page
        };
      })
    );
  }

  private filterMovie(movie: Movie): boolean {
    const ratingInRange = movie.rating >= this.searchParams.minRating &&
      movie.rating <= this.searchParams.maxRating;

    const yearMatches = !this.searchParams.year ||
      movie.year === this.searchParams.year;

    return ratingInRange && yearMatches;
  }

  private getParams(page: number): HttpParams {
    let params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('page', page.toString());

    // Add query parameter if searching by title
    if (this.searchParams.query) {
      params = params.set('query', this.searchParams.query);
    } else {
      // If no query, we're using discover endpoint, so add vote_average filter
      params = params
        .set('vote_average.gte', this.searchParams.minRating.toString())
        .set('vote_average.lte', this.searchParams.maxRating.toString());
    }

    // Add year filter if specified
    if (this.searchParams.year) {
      params = params.set('primary_release_year', this.searchParams.year);
    }

    // Add sorting
    params = params.set('sort_by', 'popularity.desc');

    return params;
  }

  updateSearchParams(params: Partial<typeof this.searchParams>) {
    this.searchParams = { ...this.searchParams, ...params };
  }




  getPopularMovies(page: number = 1): Observable<any> {
    return this.http.get<any>(
      `${this.baseUrl}/movie/popular`,
      { params: this.getParams(page) }
    );
  }

  movieDataParser(pageNum: number) {

    return this.getPopularMovies(pageNum).pipe(
      map((res) => {
        const newMovies = res.results;

        // Filter out duplicates
        const filteredMovies = newMovies.filter((movie: any) => {
          return !this.movieData.some(existingMovie => existingMovie.id === movie.id);
        });

        let parsedMovies: Movie[] = filteredMovies.map((movie: any) => ({
          id: movie['id'],
          title: movie['title'],
          description: movie['overview'],
          poster_path: movie['poster_path'],
          rating: movie['vote_average'],
          year: movie['release_date'].split('-')[0]
        }));

        // Append only the new movies
        if (parsedMovies.length > 0) {
          this.movieData.push(...parsedMovies);
        }

        this.totalPages++
        this.originalMovieData = []
        // console.log('Updated movieData:', this.movieData);
        return parsedMovies;

        // Log the updated movieData to ensure it's being updated

      })
    );

  }

  // movie.service.ts
  // Add this method to your existing service


}
