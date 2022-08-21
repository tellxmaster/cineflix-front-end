import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { BehaviorSubject, catchError, map, Observable, of, startWith } from 'rxjs';
import { DataState } from '../../../cineflix/enum/data-state';
import { AppState } from '../../../cineflix/interfaces/app-state';
import { CustomResponse } from '../../../cineflix/interfaces/custom-response';
import { CrudService } from '../../../cineflix/services/crud.service';
import { Sexo } from '../../interfaces/sexo';
@Component({
  selector: 'app-sexos',
  templateUrl: './sexos.component.html',
  styles: [
  ]
})
export class SexosComponent implements OnInit {

  appState$!: Observable<AppState<CustomResponse>>;
  readonly DataState = DataState;
  private dataSubject = new BehaviorSubject<CustomResponse>(null!);
  private isLoading = new BehaviorSubject<boolean>(false);
  private isEditing = new BehaviorSubject<boolean>(false);
  private sexo!: Sexo;
  private editId!: number;
  showGuardar!: boolean;
  showEditar!: boolean;
  isLoading$ = this.isLoading.asObservable();
  pageSize = 8;
  desde: number = 0;
  hasta: number = 8;

  

  SexoForm: FormGroup = this.fb.group({
    sex_nombre:    ['', [Validators.required]],
  });

  constructor(private crudService: CrudService, private fb: FormBuilder){}
  ngOnInit(): void{
    this.appState$ = this.crudService.sexos$
    .pipe(
      map(response => {
        this.dataSubject.next(response);
        
        return { dataState: DataState.LOADED_STATE, appData: {...response, data: { sexos: response.data.sexos.reverse() }} }
      }),
      startWith({ dataState: DataState.LOADING_STATE }),
      catchError((error: String) => {
        return of({ dataState: DataState.ERROR_STATE, error: error })
      })
    );
  }

  saveSexo(){
    if(this.showGuardar){
      this.isLoading.next(true);
      console.log(this.SexoForm.value);
      this.appState$ = this.crudService.saveSexo$(this.SexoForm.value as Sexo)
      .pipe(
        map(response => {
          this.dataSubject.next(
            {...response, data: { sexos: [response.data.sexo, ...this.dataSubject.value.data.sexos] } }
          );
          document.getElementById('closeModal')!.click();
          this.SexoForm.reset(this.SexoForm.value);
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
      const {sex_nombre} = this.SexoForm.value;
      this.sexo = {
        "id": this.editId,
        "sex_nombre": sex_nombre
      }
      this.appState$ = this.crudService.updateSexo$(this.sexo)
      .pipe(
        map(response => {
          this.dataSubject.next(
            {...response, data: { sexos: [response.data.sexo, ...this.dataSubject.value.data.sexos.filter((s: Sexo) => s.id !== this.sexo.id)] } }
          );
          document.getElementById('closeModal')!.click();
          this.SexoForm.reset(this.SexoForm.value);
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

  deleteSexo(sexo: Sexo){
    
    this.appState$ = this.crudService.deleteSexo$(sexo.id)
    .pipe(
      map(response => {
        this.dataSubject.next(
          {...response, data:
            {
              sexos: this.dataSubject.value.data.sexos.filter((s: Sexo) => s.id !== sexo.id) 
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

  getData(sexo: Sexo){
    this.showEditar = true;
    this.showGuardar = false;
    this.isLoading.next(true);
    console.log(sexo.id);
    this.editId = sexo.id;
    this.SexoForm.get('sex_nombre')?.patchValue(sexo.sex_nombre);
    this.isLoading.next(false);
  }

  updateSocio(){
    console.log("Estoy actualizando");
  }

  setShowGuardar(){
    this.showGuardar = true;
    this.showEditar = false;
    this.SexoForm.reset(this.SexoForm.value);
  }


}
