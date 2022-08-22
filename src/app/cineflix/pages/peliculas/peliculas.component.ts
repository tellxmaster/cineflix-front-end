import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of, startWith } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { DataState } from '../../../cineflix/enum/data-state';
import { AppState } from '../../../cineflix/interfaces/app-state';
import { CustomResponse } from '../../../cineflix/interfaces/custom-response';
import { CrudService } from '../../../cineflix/services/crud.service';
import { Genero } from '../../interfaces/genero';
import { Formato } from '../../interfaces/formato';
import { Director } from '../../interfaces/director';
import { Pelicula } from '../../interfaces/pelicula';
@Component({
  selector: 'app-peliculas',
  templateUrl: './peliculas.component.html',
  styles: [
  ]
})
export class PeliculasComponent implements OnInit {

  appState$!: Observable<AppState<CustomResponse>>;
  readonly DataState = DataState;
  private dataSubject = new BehaviorSubject<CustomResponse>(null!);
  private isLoading = new BehaviorSubject<boolean>(false);
  private isEditing = new BehaviorSubject<boolean>(false);
  public fechaEstreno!: Date;
  public directores: Director[] = [];
  public formatos: Formato[] = [];
  public generos: Genero[] = [];
  private pelicula!: Pelicula;
  private editId!: number;
  showGuardar!: boolean;
  showEditar!: boolean;
  isLoading$ = this.isLoading.asObservable();
  pageSize = 8;
  desde: number = 0;
  hasta: number = 8;

  

  PeliculaForm: FormGroup = this.fb.group({
    pel_nombre:         ['', [Validators.required]],
    dir_id:             ['', [Validators.required]],
    gen_id:             ['', [Validators.required]],
    for_id:             ['', [Validators.required]],
    pel_fecha_est:      ['', [Validators.required]],
    pel_costo:          ['', [Validators.required]]
  });

  constructor(private crudService: CrudService, private fb: FormBuilder){}
  ngOnInit(): void{
    this.appState$ = this.crudService.peliculas$
    .pipe(
      map(response => {
        this.dataSubject.next(response);
        return { dataState: DataState.LOADED_STATE, appData: {...response, data: { peliculas: response.data.peliculas.reverse() }} }
      }),
      startWith({ dataState: DataState.LOADING_STATE }),
      catchError((error: String) => {
        return of({ dataState: DataState.ERROR_STATE, error: error })
      })
    );

    this.crudService.directores$
    .subscribe(
      (response) => {
        response.data.directores.forEach((director: Director) => {
          this.directores.push({"id": director.id, "dir_nombre": director.dir_nombre});
          //console.log(sexo.id+" "+sexo.sex_nombre);
        })
      },
      error => console.error(error)
    );
    
    this.crudService.generos$
    .subscribe(
      (response) => {
        response.data.generos.forEach((genero: Genero) => {
          this.generos.push({"id": genero.id, "gen_nombre": genero.gen_nombre});
          //console.log(sexo.id+" "+sexo.sex_nombre);
        })
      },
      error => console.error(error)
    );

    this.crudService.formatos$
    .subscribe(
      (response) => {
        response.data.formatos.forEach((formato: Formato) => {
          this.formatos.push({"id": formato.id, "for_nombre": formato.for_nombre});
          //console.log(sexo.id+" "+sexo.sex_nombre);
        })
      },
      error => console.error(error)
    );
    
  }

  savePelicula(){
    if(this.showGuardar){
      this.isLoading.next(true);
      console.log(this.PeliculaForm.value);
      this.appState$ = this.crudService.savePelicula$(this.PeliculaForm.value as Pelicula)
      .pipe(
        map(response => {
          this.dataSubject.next(
            {...response, data: { peliculas: [response.data.pelicula, ...this.dataSubject.value.data.peliculas] } }
          );
          document.getElementById('closeModal')!.click();
          this.PeliculaForm.reset(this.PeliculaForm.value);
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
      const {pel_nombre,dir_id,gen_id,for_id,pel_fecha_est,pel_costo} = this.PeliculaForm.value;
      this.pelicula = {
        "id": this.editId,
        "pel_nombre": pel_nombre,
        "dir_id": dir_id,
        "gen_id": gen_id,
        "for_id": for_id,
        "pel_fecha_est": pel_fecha_est,
        "pel_costo": pel_costo
      }
      this.appState$ = this.crudService.updatePelicula$(this.pelicula)
      .pipe(
        map(response => {
          this.dataSubject.next(
            {...response, data: { peliculas: [response.data.pelicula, ...this.dataSubject.value.data.peliculas.filter((p: Pelicula) => p.id !== this.pelicula.id)] } }
          );
          document.getElementById('closeModal')!.click();
          this.PeliculaForm.reset(this.PeliculaForm.value);
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

  deletePelicula(pelicula: Pelicula){
    
    this.appState$ = this.crudService.deletePelicula$(pelicula.id)
    .pipe(
      map(response => {
        this.dataSubject.next(
          {...response, data:
            {
              peliculas: this.dataSubject.value.data.peliculas.filter((p: Pelicula) => p.id !== pelicula.id) 
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

  getData(pelicula: Pelicula){
    this.showEditar = true;
    this.showGuardar = false;
    this.isLoading.next(true);
    console.log(pelicula.id);
    this.editId = pelicula.id;
    this.PeliculaForm.get('pel_nombre')?.patchValue(pelicula.pel_nombre);
    this.PeliculaForm.get('dir_id')?.setValue(pelicula.dir_id);
    console.log(pelicula.dir_id);
    this.PeliculaForm.get('gen_id')?.setValue(pelicula.gen_id);
    this.PeliculaForm.get('for_id')?.setValue(pelicula.for_id);
    this.fechaEstreno = pelicula.pel_fecha_est!;
    this.PeliculaForm.get('pel_costo')?.patchValue(pelicula.pel_costo);
    this.isLoading.next(false);
    
  }



  setShowGuardar(){
    this.showGuardar = true;
    this.showEditar = false;
    this.PeliculaForm.reset(this.PeliculaForm.value);
  }

}
