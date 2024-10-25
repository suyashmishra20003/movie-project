import { Routes } from '@angular/router';
import { MovieSearchComponent } from './components/movie-search/movie-search.component';
import { FavoriteComponent } from './components/favorite/favorite.component';

export const routes: Routes = [
    { path: '', component: MovieSearchComponent },
    { path: 'search', component: MovieSearchComponent },
    { path: 'favorites', component:  FavoriteComponent},
];
