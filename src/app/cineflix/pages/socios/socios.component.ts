import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, catchError, map, Observable, of, startWith } from 'rxjs';
import { DataState } from '../../../cineflix/enum/data-state';
import { AppState } from '../../../cineflix/interfaces/app-state';
import { CustomResponse } from '../../../cineflix/interfaces/custom-response';
import { CrudService } from '../../../cineflix/services/crud.service';
import { Socio } from '../../interfaces/socio';


@Component({
  selector: 'app-socios',
  templateUrl: './socios.component.html',
  styles: [
  ]
})
export class SociosComponent implements OnInit {

  appState$!: Observable<AppState<CustomResponse>>;
  readonly DataState = DataState;
  private dataSubject = new BehaviorSubject<CustomResponse>(null!);
  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();

  

  SocioForm: FormGroup = this.fb.group({
    cedula:    ['', [Validators.required, Validators.minLength(10)]],
    nombre:    ['', [Validators.required, Validators.minLength(8)]],
    direccion: ['', [Validators.required]],
    telefono:  ['', [Validators.required, Validators.minLength(10)]],
    correo:    ['', [Validators.required, Validators.email]],
  });

  constructor(private crudService: CrudService, private fb: FormBuilder){}

  ngOnInit(): void{
    this.appState$ = this.crudService.socios$
    .pipe(
      map(response => {
        this.dataSubject.next(response);
        return { dataState: DataState.LOADED_STATE, appData: response }
      }),
      startWith({ dataState: DataState.LOADING_STATE }),
      catchError((error: String) => {
        return of({ dataState: DataState.ERROR_STATE, error: error })
      })
    );
  }

  saveSocio(){
    this.isLoading.next(true);
    console.log(this.SocioForm.value);
    this.appState$ = this.crudService.saveSocio$(this.SocioForm.value as Socio)
    .pipe(
      map(response => {
        this.dataSubject.next(
          {...response, data: { socios: [response.data.socio, ...this.dataSubject.value.data.socios] } }
        );
        document.getElementById('closeModal')!.click();
        this.SocioForm.reset(this.SocioForm.value);
        this.isLoading.next(false);
        return {dataState: DataState.LOADED_STATE, appData: this.dataSubject.value}
      }),
      startWith({ dataState: DataState.LOADING_STATE, appData: this.dataSubject.value }),
      catchError((error: string) => {
        this.isLoading.next(false);
        return of({dataState: DataState.ERROR_STATE, error})
      })
    );
  }

}
