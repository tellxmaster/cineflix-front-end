import { Component } from '@angular/core';

interface MenuItem {
  ruta: string;
  texto: string;
}

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styles: [
  ]
})
export class MenuComponent{

  display: boolean = false;

  menu: MenuItem[] = [
    {
      ruta: '/cineflix/dashboard',
      texto: 'Dashboard'
    },
    {
      ruta: '/cineflix/socios',
      texto: 'Socios'
    },
    {
      ruta: '/cineflix/actores',
      texto: 'Actores'
    },
    {
      ruta: '/cineflix/actores-peliculas',
      texto: 'Actores Peliculas'
    },
    {
      ruta: '/cineflix/alquileres',
      texto: 'Alquileres'
    },
    {
      ruta: '/cineflix/directores',
      texto: 'Directores'
    },
    {
      ruta: '/cineflix/formatos',
      texto: 'Formatos'
    },
    {
      ruta: '/cineflix/generos',
      texto: 'Generos'
    },
    {
      ruta: '/cineflix/peliculas',
      texto: 'Peliculas'
    },
    {
      ruta: '/cineflix/sexos',
      texto: 'Sexos'
    }

  ];


}
