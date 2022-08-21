import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, startWith } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { DataState } from '../../../cineflix/enum/data-state';
import { AppState } from '../../../cineflix/interfaces/app-state';
import { CustomResponse } from '../../../cineflix/interfaces/custom-response';
import { CrudService } from '../../../cineflix/services/crud.service';
import { Genero } from '../../interfaces/genero';

@Component({
  selector: 'app-generos',
  templateUrl: './generos.component.html',
  styles: [
  ]
})
export class GenerosComponent implements OnInit {

  appState$!: Observable<AppState<CustomResponse>>;
  readonly DataState = DataState;
  private dataSubject = new BehaviorSubject<CustomResponse>(null!);
  private isLoading = new BehaviorSubject<boolean>(false);
  private isEditing = new BehaviorSubject<boolean>(false);
  private genero!: Genero;
  private editId!: number;
  showGuardar!: boolean;
  showEditar!: boolean;
  isLoading$ = this.isLoading.asObservable();
  pageSize = 8;
  desde: number = 0;
  hasta: number = 8;

  

  GeneroForm: FormGroup = this.fb.group({
    gen_nombre:    ['', [Validators.required]],
  });

  constructor(private crudService: CrudService, private fb: FormBuilder){}
  ngOnInit(): void{
    this.appState$ = this.crudService.generos$
    .pipe(
      map(response => {
        this.dataSubject.next(response);
        
        return { dataState: DataState.LOADED_STATE, appData: {...response, data: { generos: response.data.generos.reverse() }} }
      }),
      startWith({ dataState: DataState.LOADING_STATE }),
      catchError((error: String) => {
        return of({ dataState: DataState.ERROR_STATE, error: error })
      })
    );
  }

  saveGenero(){
    if(this.showGuardar){
      this.isLoading.next(true);
      console.log(this.GeneroForm.value);
      this.appState$ = this.crudService.saveGenero$(this.GeneroForm.value as Genero)
      .pipe(
        map(response => {
          this.dataSubject.next(
            {...response, data: { generos: [response.data.genero, ...this.dataSubject.value.data.generos] } }
          );
          document.getElementById('closeModal')!.click();
          this.GeneroForm.reset(this.GeneroForm.value);
          this.isLoading.next(false);
          return {dataState: DataState.LOADED_STATE, appData: this.dataSubject.value}
        }),
        startWith({ dataState: DataState.LOADING_STATE, appData: this.dataSubject.value }),
        catchError((error: string) => {
          this.isLoading.next(false);
          return of({dataState: DataState.ERROR_STATE, error})
        })
      );
    }else{
      console.log("Editando");
      this.isLoading.next(true);
      const {gen_nombre} = this.GeneroForm.value;
      this.genero = {
        "id": this.editId,
        "gen_nombre": gen_nombre
      }
      this.appState$ = this.crudService.updateGenero$(this.genero)
      .pipe(
        map(response => {
          this.dataSubject.next(
            {...response, data: { generos: [response.data.genero, ...this.dataSubject.value.data.generos.filter((d: Genero) => d.id !== this.genero.id)] } }
          );
          document.getElementById('closeModal')!.click();
          this.GeneroForm.reset(this.GeneroForm.value);
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

  deleteGenero(genero: Genero){
    
    this.appState$ = this.crudService.deleteGenero$(genero.id)
    .pipe(
      map(response => {
        this.dataSubject.next(
          {...response, data:
            {
              generos: this.dataSubject.value.data.generos.filter((d: Genero) => d.id !== genero.id) 
            }}
        );
        return {dataState: DataState.LOADED_STATE, appData: this.dataSubject.value}
      }),
      startWith({ dataState: DataState.LOADING_STATE, appData: this.dataSubject.value }),
      catchError((error: string) => {
        this.isLoading.next(false);
        return of({dataState: DataState.ERROR_STATE, error})
      })
    );
  }

  cambiarPagina(e: PageEvent){
    console.log(e);
    this.desde = e.pageIndex * e.pageSize;
    this.hasta = this.desde + e.pageSize;
  }

  getData(genero: Genero){
    this.showEditar = true;
    this.showGuardar = false;
    this.isLoading.next(true);
    console.log(genero.id);
    this.editId = genero.id;
    this.GeneroForm.get('gen_nombre')?.patchValue(genero.gen_nombre);
    this.isLoading.next(false);
  }



  setShowGuardar(){
    this.showGuardar = true;
    this.showEditar = false;
    this.GeneroForm.reset(this.GeneroForm.value);
  }

}
