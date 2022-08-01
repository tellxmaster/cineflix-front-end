import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ActoresPeliculasComponent } from './pages/actores-peliculas/actores-peliculas.component';
import { ActoresComponent } from './pages/actores/actores.component';
import { AlquileresComponent } from './pages/alquileres/alquileres.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { DirectoresComponent } from './pages/directores/directores.component';
import { FormatosComponent } from './pages/formatos/formatos.component';
import { GenerosComponent } from './pages/generos/generos.component';
import { PeliculasComponent } from './pages/peliculas/peliculas.component';
import { SexosComponent } from './pages/sexos/sexos.component';
import { SociosComponent } from './pages/socios/socios.component';

const routes: Routes = [
  {
    path: '',
    children: [
      { 
        path: 'socios', 
        component: SociosComponent
      },
      { 
        path: 'actores', 
        component: ActoresComponent
      },
      { 
        path: 'actores-peliculas', 
        component: ActoresPeliculasComponent
      },
      { 
        path: 'alquileres', 
        component: AlquileresComponent
      },
      { 
        path: 'dashboard', 
        component: DashboardComponent
      },
      { 
        path: 'directores', 
        component: DirectoresComponent
      },
      { 
        path: 'formatos', 
        component: FormatosComponent
      },
      { 
        path: 'generos', 
        component: GenerosComponent
      },
      { 
        path: 'peliculas', 
        component: PeliculasComponent
      },
      { 
        path: 'sexos', 
        component: SexosComponent
      },
      { 
        path: '**', 
        redirectTo: 'dashboard'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CineflixRoutingModule { }
