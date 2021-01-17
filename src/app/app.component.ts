import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Bienvenido a curso angular';
  curso: string = 'Curso Spring con Angular';
  profesor:string = 'Andres Guzman';
}
