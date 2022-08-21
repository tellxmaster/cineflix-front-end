import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, startWith } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { DataState } from '../../../cineflix/enum/data-state';
import { AppState } from '../../../cineflix/interfaces/app-state';
import { CustomResponse } from '../../../cineflix/interfaces/custom-response';
import { CrudService } from '../../../cineflix/services/crud.service';
import { Formato } from '../../interfaces/formato';

@Component({
  selector: 'app-formatos',
  templateUrl: './formatos.component.html',
  styles: [
  ]
})
export class FormatosComponent implements OnInit {

  appState$!: Observable<AppState<CustomResponse>>;
  readonly DataState = DataState;
  private dataSubject = new BehaviorSubject<CustomResponse>(null!);
  private isLoading = new BehaviorSubject<boolean>(false);
  private isEditing = new BehaviorSubject<boolean>(false);
  private formato!: Formato;
  private editId!: number;
  showGuardar!: boolean;
  showEditar!: boolean;
  isLoading$ = this.isLoading.asObservable();
  pageSize = 8;
  desde: number = 0;
  hasta: number = 8;

  

  FormatoForm: FormGroup = this.fb.group({
    for_nombre:    ['', [Validators.required]],
  });

  constructor(private crudService: CrudService, private fb: FormBuilder){}
  ngOnInit(): void{
    this.appState$ = this.crudService.formatos$
    .pipe(
      map(response => {
        this.dataSubject.next(response);
        
        return { dataState: DataState.LOADED_STATE, appData: {...response, data: { formatos: response.data.formatos.reverse() }} }
      }),
      startWith({ dataState: DataState.LOADING_STATE }),
      catchError((error: String) => {
        return of({ dataState: DataState.ERROR_STATE, error: error })
      })
    );
  }

  saveFormato(){
    if(this.showGuardar){
      this.isLoading.next(true);
      console.log(this.FormatoForm.value);
      this.appState$ = this.crudService.saveFormato$(this.FormatoForm.value as Formato)
      .pipe(
        map(response => {
          this.dataSubject.next(
            {...response, data: { formatos: [response.data.formato, ...this.dataSubject.value.data.formatos] } }
          );
          document.getElementById('closeModal')!.click();
          this.FormatoForm.reset(this.FormatoForm.value);
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
      const {for_nombre} = this.FormatoForm.value;
      this.formato = {
        "id": this.editId,
        "for_nombre": for_nombre
      }
      this.appState$ = this.crudService.updateFormato$(this.formato)
      .pipe(
        map(response => {
          this.dataSubject.next(
            {...response, data: { formatos: [response.data.formato, ...this.dataSubject.value.data.formatos.filter((d: Formato) => d.id !== this.formato.id)] } }
          );
          document.getElementById('closeModal')!.click();
          this.FormatoForm.reset(this.FormatoForm.value);
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

  deleteFormato(formato: Formato){
    
    this.appState$ = this.crudService.deleteFormato$(formato.id)
    .pipe(
      map(response => {
        this.dataSubject.next(
          {...response, data:
            {
              formatos: this.dataSubject.value.data.formatos.filter((d: Formato) => d.id !== formato.id) 
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

  getData(formato: Formato){
    this.showEditar = true;
    this.showGuardar = false;
    this.isLoading.next(true);
    console.log(formato.id);
    this.editId = formato.id;
    this.FormatoForm.get('for_nombre')?.patchValue(formato.for_nombre);
    this.isLoading.next(false);
  }



  setShowGuardar(){
    this.showGuardar = true;
    this.showEditar = false;
    this.FormatoForm.reset(this.FormatoForm.value);
  }

}
