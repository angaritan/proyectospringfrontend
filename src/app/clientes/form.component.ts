import { Component, OnInit } from '@angular/core';
import {Cliente}  from './cliente';
import {ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html'
})
export class FormComponent implements OnInit {
   cliente: Cliente = new Cliente();
   titulo:  string = 'Crear Cliente';
   errores: string[];

  constructor(private clienteService: ClienteService,
              private router: Router,
              private activatedRoute : ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarCliente();
  }

 public cargarCliente(): void {
  this.activatedRoute.params.subscribe(params => {
     let id = params['id'];
     if(id){
        this.clienteService.getCliente(id).subscribe( (cliente) => this.cliente = cliente )
     }
  })
 }

  public create(): void{
    this.clienteService.create(this.cliente).subscribe(
      cliente => {
        this.router.navigate(['/clientes'])
        //  Swal.fire('Nuevo Cliente', `Cliente ${json.cliente.nombre} creado con exito`, 'success')
        Swal.fire('Nuevo Cliente', `El cliente ${cliente.nombre} ha sido creado con exito.`, 'success')
      },
      err => {
         this.errores = err.error.errors as string[];
         console.error('Còdigo de error desde el Backend '+ err.status);
         console.error(err.error.errors);
      }
    )
  }
public update(): void{
  this.clienteService.update(this.cliente).subscribe(
        json => { this.router.navigate(['/clientes'])
        //Swal.fire('Nuevo Cliente', `Cliente ${cliente.nombre} actualizado con exito!`, 'success')
        Swal.fire('Nuevo Cliente', `${json.mensaje}: ${json.cliente.nombre}`, 'success')
      },
      err => {
         this.errores = err.error.errors as string[];
         console.error('Còdigo de error desde el Backend '+ err.status);
         console.error(err.error.errors);
      }
  )
}

}
