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
@Component({
  selector: 'app-actores',
  templateUrl: './actores.component.html',
  styles: [
  ]
})
export class ActoresComponent implements OnInit {

  
  appState$!: Observable<AppState<CustomResponse>>;
  readonly DataState = DataState;
  private dataSubject = new BehaviorSubject<CustomResponse>(null!);
  private isLoading = new BehaviorSubject<boolean>(false);
  private isEditing = new BehaviorSubject<boolean>(false);
  public sexos: Sexo[] = [];
  private actor!: Actor;
  private editId!: number;
  showGuardar!: boolean;
  showEditar!: boolean;
  isLoading$ = this.isLoading.asObservable();
  pageSize = 8;
  desde: number = 0;
  hasta: number = 8;

  

  ActorForm: FormGroup = this.fb.group({
    act_nombre:    ['', [Validators.required]],
    sex_id:        ['', [Validators.required]]
  });

  constructor(private crudService: CrudService, private fb: FormBuilder){}
  ngOnInit(): void{
    this.appState$ = this.crudService.actores$
    .pipe(
      map(response => {
        this.dataSubject.next(response);
        return { dataState: DataState.LOADED_STATE, appData: {...response, data: { actores: response.data.actores.reverse() }} }
      }),
      startWith({ dataState: DataState.LOADING_STATE }),
      catchError((error: String) => {
        return of({ dataState: DataState.ERROR_STATE, error: error })
      })
    );

    this.crudService.sexos$
    .subscribe(
      (response) => {
        response.data.sexos.forEach((sexo: Sexo) => {
          this.sexos.push({"id": sexo.id, "sex_nombre": sexo.sex_nombre});
          //console.log(sexo.id+" "+sexo.sex_nombre);
        })
      },
      error => console.error(error)
    );
    

    console.log(this.sexos);
    
  }

  saveActor(){
    if(this.showGuardar){
      this.isLoading.next(true);
      console.log(this.ActorForm.value);
      this.appState$ = this.crudService.saveActor$(this.ActorForm.value as Actor)
      .pipe(
        map(response => {
          this.dataSubject.next(
            {...response, data: { actores: [response.data.actor, ...this.dataSubject.value.data.actores] } }
          );
          document.getElementById('closeModal')!.click();
          this.ActorForm.reset(this.ActorForm.value);
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
      const {act_nombre, sex_id} = this.ActorForm.value;
      this.actor = {
        "id": this.editId,
        "act_nombre": act_nombre,
        "sex_id": sex_id
      }
      this.appState$ = this.crudService.updateActor$(this.actor)
      .pipe(
        map(response => {
          this.dataSubject.next(
            {...response, data: { actores: [response.data.actor, ...this.dataSubject.value.data.actores.filter((d: Genero) => d.id !== this.actor.id)] } }
          );
          document.getElementById('closeModal')!.click();
          this.ActorForm.reset(this.ActorForm.value);
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

  deleteActor(actor: Actor){
    
    this.appState$ = this.crudService.deleteActor$(actor.id)
    .pipe(
      map(response => {
        this.dataSubject.next(
          {...response, data:
            {
              actores: this.dataSubject.value.data.actores.filter((a: Actor) => a.id !== actor.id) 
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

  getData(actor: Actor){
    this.showEditar = true;
    this.showGuardar = false;
    this.isLoading.next(true);
    console.log(actor.id);
    this.editId = actor.id;
    this.ActorForm.get('act_nombre')?.patchValue(actor.act_nombre);
    this.ActorForm.get('sex_id')?.patchValue(actor.sexo?.id);
    this.isLoading.next(false);
  }



  setShowGuardar(){
    this.showGuardar = true;
    this.showEditar = false;
    this.ActorForm.reset(this.ActorForm.value);
  }

}
