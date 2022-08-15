import { Component, OnInit } from '@angular/core';
import { catchError, map, Observable, of, startWith } from 'rxjs';
import { DataState } from '../../../cineflix/enum/data-state';
import { AppState } from '../../../cineflix/interfaces/app-state';
import { CustomResponse } from '../../../cineflix/interfaces/custom-response';
import { CrudService } from '../../../cineflix/services/crud.service';

@Component({
  selector: 'app-generos',
  templateUrl: './generos.component.html',
  styles: [
  ]
})
export class GenerosComponent implements OnInit {

  appState$!: Observable<AppState<CustomResponse>>;
  readonly DataState = DataState;
  constructor(private crudService: CrudService) { }

  ngOnInit(): void {
    this.appState$ = this.crudService.generos$
    .pipe(
      map(response => {
        return { dataState: DataState.LOADED_STATE, appData: response }
      }),
      startWith({ dataState: DataState.LOADING_STATE }),
      catchError((error: String) => {
        return of({ dataState: DataState.ERROR_STATE, error: error })
      })
    );
  }


}
