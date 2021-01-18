import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import Swal from 'sweetalert2';
import { tap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html'

})
export class ClientesComponent implements OnInit {

  clientes : Cliente[];
  paginador : any;

  constructor(private clienteService: ClienteService,
              private router: Router,
              private activatedRoute : ActivatedRoute) { }

  ngOnInit(){
  // se agrega la variable page para el metodo adecuado de paginacion
  // se modifica la linea de codigo  tap(clientes=>{  / por tap(response=>  y  clientes.forEach(cliente =>
  //{ / con tipo response.content as Cliente[] para metodo adecuado con paginacion
  //  let page = 0;
  //  this.clientes = this.clienteService.getClientes();

  //Agregamos un observable para el paramMap cuando cambie de parametro de pagina por paginador
  // y no tenga que volver a construir y cargar; con el ActivatedRoute y route

  this.activatedRoute.paramMap.subscribe(params =>{
  //el +params es para convertir a numero el string que recibe
    let page: number = +params.get('page');
    if(!page) {
      page = 0;
    }
      this.clienteService.getClientes(page).pipe(
        //tap(clientes=>{
        tap(response =>{
          console.log('ClienteComponent: tap 3');
          //clientes.forEach(cliente => {
            (response.content as Cliente[]).forEach(cliente => {
            console.log(cliente.apellido);
          });
        })
      ).subscribe(
        //se modifica esta linea para adecuar a respuesta con  content en el json para paginacion
       //(clientes) => {this.clientes = clientes }
        response => {
          this.clientes = response.content as Cliente[];
          this.paginador = response;
        }
      );
  });
}

  delete(cliente: Cliente){
    const swalWithBootstrapButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: false
})

swalWithBootstrapButtons.fire({
  title: 'Esta seguro?',
  text: `¿Seguro que desea eliminar al cliente  ${cliente.nombre} ${cliente.apellido}`,
  icon: 'warning',
  showCancelButton: true,
  confirmButtonText: 'Si, eliminar!',
  cancelButtonText: 'No, cancel!',
  reverseButtons: true
}).then((result) => {
  if (result.isConfirmed) {
     this.clienteService.delete(cliente.id).subscribe(
       response => {
         this.clientes = this.clientes.filter(cli => cli!== cliente)
         swalWithBootstrapButtons.fire(
           'Cliente Eliminado!',
           `Cliente ${cliente.nombre} eliminado con èxito.`,
           'success'
         )
       }
     )
  }
})

  }

}
