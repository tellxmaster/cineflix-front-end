import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, catchError, map, Observable, of, startWith } from 'rxjs';
import { DataState } from '../../../cineflix/enum/data-state';
import { AppState } from '../../../cineflix/interfaces/app-state';
import { CustomResponse } from '../../../cineflix/interfaces/custom-response';
import { CrudService } from '../../../cineflix/services/crud.service';
import { Socio } from '../../interfaces/socio';
import { PageEvent } from '@angular/material/paginator';

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
  private isEditing = new BehaviorSubject<boolean>(false);
  showGuardar!: boolean;
  showEditar!: boolean;
  isLoading$ = this.isLoading.asObservable();
  pageSize = 8;
  desde: number = 0;
  hasta: number = 8;

  

  SocioForm: FormGroup = this.fb.group({
    cedula:    ['', [Validators.required, Validators.minLength(10)]],
    nombre:    ['', [Validators.required, Validators.minLength(8)]],
    direccion: ['', [Validators.required]],
    telefono:  ['', [Validators.required, Validators.minLength(10)]],
    correo:    ['', [Validators.required, Validators.email]],
  });

  constructor(private crudService: CrudService, private fb: FormBuilder, private _Activatedroute: ActivatedRoute){}
  ngOnInit(): void{
    this.appState$ = this.crudService.socios$
    .pipe(
      map(response => {
        this.dataSubject.next(response);
        
        return { dataState: DataState.LOADED_STATE, appData: {...response, data: { socios: response.data.socios.reverse() }} }
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

  deleteSocio(socio: Socio){
    
    this.appState$ = this.crudService.deleteSocio$(socio.id)
    .pipe(
      map(response => {
        this.dataSubject.next(
          {...response, data:
            {
              socios: this.dataSubject.value.data.socios.filter((s: Socio) => s.id !== socio.id) 
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

  getData(socio: Socio){
    this.showEditar = true;
    this.showGuardar = false;
    this.isLoading.next(true);
    this.SocioForm.get('cedula')?.patchValue(socio.cedula);
    this.SocioForm.get('nombre')?.patchValue(socio.nombre);
    this.SocioForm.get('direccion')?.patchValue(socio.direccion);
    this.SocioForm.get('telefono')?.patchValue(socio.telefono);
    this.SocioForm.get('correo')?.patchValue(socio.correo);
    this.isLoading.next(false);
  }

  updateSocio(){
    console.log("Estoy actualizando");
  }

  setShowGuardar(){
    this.showGuardar = true;
    this.showEditar = false;
    this.SocioForm.reset(this.SocioForm.value);
  }

}
