import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CineflixRoutingModule } from './cineflix-routing.module';
import { SociosComponent } from './pages/socios/socios.component';
import { AlquileresComponent } from './pages/alquileres/alquileres.component';
import { PeliculasComponent } from './pages/peliculas/peliculas.component';
import { GenerosComponent } from './pages/generos/generos.component';
import { FormatosComponent } from './pages/formatos/formatos.component';
import { DirectoresComponent } from './pages/directores/directores.component';
import { ActoresPeliculasComponent } from './pages/actores-peliculas/actores-peliculas.component';
import { ActoresComponent } from './pages/actores/actores.component';
import { SexosComponent } from './pages/sexos/sexos.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { SharedModule } from '../shared/shared.module';
import { MainComponent } from './pages/main/main.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    SociosComponent,
    AlquileresComponent,
    PeliculasComponent,
    GenerosComponent,
    FormatosComponent,
    DirectoresComponent,
    ActoresPeliculasComponent,
    ActoresComponent,
    SexosComponent,
    DashboardComponent,
    SidenavComponent,
    MainComponent,
    ProfileComponent
  ],
  imports: [
    CommonModule,
    CineflixRoutingModule,
    SharedModule,
    ReactiveFormsModule,
  ]
})
export class CineflixModule { }
