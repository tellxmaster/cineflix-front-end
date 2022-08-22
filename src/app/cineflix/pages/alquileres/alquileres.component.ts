import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, startWith } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { DataState } from '../../../cineflix/enum/data-state';
import { AppState } from '../../../cineflix/interfaces/app-state';
import { CustomResponse } from '../../../cineflix/interfaces/custom-response';
import { CrudService } from '../../../cineflix/services/crud.service';
import { Genero } from '../../interfaces/genero';
import { Actor } from '../../interfaces/actor';
import { Sexo } from '../../interfaces/sexo';
import { Formato } from '../../interfaces/formato';
import { Director } from '../../interfaces/director';
import { Pelicula } from '../../interfaces/pelicula';
import { Socio } from '../../interfaces/socio';
import { Alquiler } from '../../interfaces/alquiler';

@Component({
  selector: 'app-alquileres',
  templateUrl: './alquileres.component.html',
  styles: [
  ]
})
export class AlquileresComponent implements OnInit {

  appState$!: Observable<AppState<CustomResponse>>;
  readonly DataState = DataState;
  private dataSubject = new BehaviorSubject<CustomResponse>(null!);
  private isLoading = new BehaviorSubject<boolean>(false);
  private isEditing = new BehaviorSubject<boolean>(false);
  public fechaDesde!: Date;
  public fechaHasta!: Date;
  public fechaEntrega!: Date;
  public socios: Socio[] = [];
  public peliculas: Pelicula[] = [];
  private alquiler!: Alquiler;
  private editId!: number;
  showGuardar!: boolean;
  showEditar!: boolean;
  isLoading$ = this.isLoading.asObservable();
  pageSize = 8;
  desde: number = 0;
  hasta: number = 8;

  

  AlquilerForm: FormGroup = this.fb.group({
    soc_id:             ['', [Validators.required]],
    pel_id:             ['', [Validators.required]],
    alq_fecha_desde:    ['', [Validators.required]],
    alq_fecha_hasta:    ['', [Validators.required]],
    alq_valor:          ['', [Validators.required]],
    alq_fecha_entrega:  ['', [Validators.required]]
  });

  constructor(private crudService: CrudService, private fb: FormBuilder){}
  ngOnInit(): void{
    this.appState$ = this.crudService.alquileres$
    .pipe(
      map(response => {
        this.dataSubject.next(response);
        return { dataState: DataState.LOADED_STATE, appData: {...response, data: { alquileres: response.data.alquileres.reverse() }} }
      }),
      startWith({ dataState: DataState.LOADING_STATE }),
      catchError((error: String) => {
        return of({ dataState: DataState.ERROR_STATE, error: error })
      })
    );

    this.crudService.socios$
    .subscribe(
      (response) => {
        response.data.socios.forEach((socio: Socio) => {
          this.socios.push(socio);
          //console.log(sexo.id+" "+sexo.sex_nombre);
        })
      },
      error => console.error(error)
    );
    
    this.crudService.peliculas$
    .subscribe(
      (response) => {
        response.data.peliculas.forEach((pelicula: Pelicula) => {
          this.peliculas.push(pelicula);
          //console.log(sexo.id+" "+sexo.sex_nombre);
        })
      },
      error => console.error(error)
    );
    
  }

  saveAlquiler(){
    if(this.showGuardar){
      this.isLoading.next(true);
      console.log(this.AlquilerForm.value);
      this.appState$ = this.crudService.saveAlquiler$(this.AlquilerForm.value as Alquiler)
      .pipe(
        map(response => {
          this.dataSubject.next(
            {...response, data: { alquileres: [response.data.alquiler, ...this.dataSubject.value.data.alquileres] } }
          );
          document.getElementById('closeModal')!.click();
          this.AlquilerForm.reset(this.AlquilerForm.value);
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
      const {soc_id,pel_id,alq_fecha_desde,alq_fecha_hasta,alq_valor,alq_fecha_entrega} = this.AlquilerForm.value;
      this.alquiler = {
        "id": this.editId,
        "soc_id": soc_id,       
        "pel_id": pel_id,      
        "alq_fecha_desde": alq_fecha_desde,
        "alq_fecha_hasta": alq_fecha_hasta,  
        "alq_valor": alq_valor       , 
        "alq_fecha_entrega": alq_fecha_entrega
      }
      this.appState$ = this.crudService.updateAlquiler$(this.alquiler)
      .pipe(
        map(response => {
          this.dataSubject.next(
            {...response, data: { alquileres: [response.data.alquiler, ...this.dataSubject.value.data.alquileres.filter((a: Alquiler) => a.id !== this.alquiler.id)] } }
          );
          console.log("Update: \n"+ response);
          document.getElementById('closeModal')!.click();
          this.AlquilerForm.reset(this.AlquilerForm.value);
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

  deleteAlquiler(alquiler: Alquiler){
    
    this.appState$ = this.crudService.deleteAlquiler$(alquiler.id)
    .pipe(
      map(response => {
        this.dataSubject.next(
          {...response, data:
            {
              alquileres: this.dataSubject.value.data.alquileres.filter((a: Alquiler) => a.id !== alquiler.id) 
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

  getData(alquiler: Alquiler){
    this.showEditar = true;
    this.showGuardar = false;
    this.isLoading.next(true);
    this.editId = alquiler.id;
    this.AlquilerForm.get('soc_id')?.patchValue(alquiler.socio?.id);
    this.AlquilerForm.get('pel_id')?.patchValue(alquiler.peliculaAlq?.id);
    this.fechaDesde = alquiler.alq_fecha_desde;
    this.fechaHasta = alquiler.alq_fecha_hasta;
    this.AlquilerForm.get('alq_valor')?.patchValue(alquiler.alq_valor);
    this.fechaEntrega = alquiler.alq_fecha_entrega;
    this.isLoading.next(false);
    console.log(alquiler);
    
  }



  setShowGuardar(){
    this.showGuardar = true;
    this.showEditar = false;
    this.AlquilerForm.reset(this.AlquilerForm.value);
  }


}
