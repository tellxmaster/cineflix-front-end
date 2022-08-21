import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, startWith } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { DataState } from '../../../cineflix/enum/data-state';
import { AppState } from '../../../cineflix/interfaces/app-state';
import { CustomResponse } from '../../../cineflix/interfaces/custom-response';
import { CrudService } from '../../../cineflix/services/crud.service';
import { Director } from '../../interfaces/director';
@Component({
  selector: 'app-directores',
  templateUrl: './directores.component.html',
  styles: [
  ]
})
export class DirectoresComponent implements OnInit {

    appState$!: Observable<AppState<CustomResponse>>;
    readonly DataState = DataState;
    private dataSubject = new BehaviorSubject<CustomResponse>(null!);
    private isLoading = new BehaviorSubject<boolean>(false);
    private isEditing = new BehaviorSubject<boolean>(false);
    private director!: Director;
    private editId!: number;
    showGuardar!: boolean;
    showEditar!: boolean;
    isLoading$ = this.isLoading.asObservable();
    pageSize = 8;
    desde: number = 0;
    hasta: number = 8;
  
    
  
    DirectorForm: FormGroup = this.fb.group({
      dir_nombre:    ['', [Validators.required]],
    });
  
    constructor(private crudService: CrudService, private fb: FormBuilder){}
    ngOnInit(): void{
      this.appState$ = this.crudService.directores$
      .pipe(
        map(response => {
          this.dataSubject.next(response);
          
          return { dataState: DataState.LOADED_STATE, appData: {...response, data: { directores: response.data.directores.reverse() }} }
        }),
        startWith({ dataState: DataState.LOADING_STATE }),
        catchError((error: String) => {
          return of({ dataState: DataState.ERROR_STATE, error: error })
        })
      );
    }
  
    saveDirector(){
      if(this.showGuardar){
        this.isLoading.next(true);
        console.log(this.DirectorForm.value);
        this.appState$ = this.crudService.saveDirector$(this.DirectorForm.value as Director)
        .pipe(
          map(response => {
            this.dataSubject.next(
              {...response, data: { directores: [response.data.director, ...this.dataSubject.value.data.directores] } }
            );
            document.getElementById('closeModal')!.click();
            this.DirectorForm.reset(this.DirectorForm.value);
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
        const {dir_nombre} = this.DirectorForm.value;
        this.director = {
          "id": this.editId,
          "dir_nombre": dir_nombre
        }
        this.appState$ = this.crudService.updateDirector$(this.director)
        .pipe(
          map(response => {
            this.dataSubject.next(
              {...response, data: { directores: [response.data.director, ...this.dataSubject.value.data.directores.filter((d: Director) => d.id !== this.director.id)] } }
            );
            document.getElementById('closeModal')!.click();
            this.DirectorForm.reset(this.DirectorForm.value);
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
  
    deleteDirector(director: Director){
      
      this.appState$ = this.crudService.deleteDirector$(director.id)
      .pipe(
        map(response => {
          this.dataSubject.next(
            {...response, data:
              {
                directores: this.dataSubject.value.data.directores.filter((d: Director) => d.id !== director.id) 
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
  
    getData(director: Director){
      this.showEditar = true;
      this.showGuardar = false;
      this.isLoading.next(true);
      console.log(director.id);
      this.editId = director.id;
      this.DirectorForm.get('dir_nombre')?.patchValue(director.dir_nombre);
      this.isLoading.next(false);
    }
  
    updateSocio(){
      console.log("Estoy actualizando");
    }
  
    setShowGuardar(){
      this.showGuardar = true;
      this.showEditar = false;
      this.DirectorForm.reset(this.DirectorForm.value);
    }
  
  
}
