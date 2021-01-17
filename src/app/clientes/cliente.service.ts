import { Injectable } from '@angular/core';
import { formatDate, DatePipe,  registerLocaleData } from '@angular/common';
import  localeES from '@angular/common/locales/es';
//import { CLIENTES } from './clientes.json';
import { Cliente } from './cliente';
import { of, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';



@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private urlEndpoint: string  = 'http://localhost:8085/api/clientes';
  private httpHeaders = new HttpHeaders({'Conten-Type':'appication/jason'});
  constructor(private http: HttpClient, private router : Router) {  }

  // getClientes():Observable<Cliente[]>- se cambio ya que con el paginador
  //desde core no devuelve un listado con Cliente sino un objeto content dentro del cual esta lista de tipo Cliente[]
  //getClientes():Observable<Cliente[]>{

  getClientes(page: number):Observable<any>{
    //return of(CLIENTES);
    //Este siguiente metodo trae la respuesta con formato JSON desde Backend a partir de urlEndpoint
    //return this.http.get<Cliente[]>(this.urlEndpoint);
    //return this.http.get(this.urlEndpoint).pipe(
    // se  incluye la url con el parametro page para el paginador
    return this.http.get(this.urlEndpoint+ '/page/' + page).pipe(
    //  map((response) =>  response as Cliente[] )
  // En esta funcion map((response) = >{ y  tap(response =>  { let clientes = response as Clientes// lo quitamos y lo hacemos con el response})
  // el response es un objeto  se modifica a un atributo mas flexible que aborde un Json con diferentes atributos
  //  tap(response => {
    tap((response:any) => {
      //let clientes = response as Cliente[];
      console.log('ClienteService: tap 1');
      //clientes.forEach(cliente => {
      (response.content as Cliente[]).forEach(cliente => {
        console.log(cliente.nombre);
      });
    }),
    //modificacion de  -  map( respose => {  a
    map((response: any) =>{
     //let clientes = response as Cliente[];
    //     return clientes.map( cliente =>{
           (response.content as Cliente[]).map( cliente =>{
           cliente.nombre = cliente.nombre.toUpperCase();
           //cliente.createAt = formatDate(cliente.createAt, 'dd-MM-yyyy', 'en-US');
           let datePipe = new DatePipe('es'); //en-US
           ///se comenta para prueba desde plantilla para dar formato a campos
           //cliente.createAt = datePipe.transform(cliente.createAt, 'EEEE dd, MMMM yyyy');  //formato- 'EEEE dd, MMMM yyyy'  o 'fullDate'
           return cliente;
         })
         //se agrega esta sentencia ya que se elimino el return clientes.map( cliente =>{
         return response;
    }),
    tap( response =>{
      console.log('ClienteService: tap 2');
      // Modificacion de response para que incluya respuesta json de paginador
      //response.forEach(cliente => {
      (response.content as Cliente[]).forEach(cliente => {
        console.log(cliente.apellido);
      });
    })
    );
    }

  create(cliente : Cliente) : Observable<Cliente>{
    return this.http.post(this.urlEndpoint, cliente, {headers: this.httpHeaders}).pipe(
      map((response: any) =>response.cliente as Cliente),
      catchError(e =>{
        if(e.status = 400){
          return throwError(e);
        }
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    );
  }

  getCliente(id): Observable<Cliente>{
    return this.http.get<Cliente>(`${this.urlEndpoint}/${id}`).pipe(
      catchError(e  => {
        this.router.navigate(['/clientes']);
        console.error(e.error.mensaje);
        Swal.fire('Error al Editar', e.error.mensaje, 'error');
        return throwError(e);
      })
    );
  }

  update(cliente: Cliente):  Observable<any>{
    return this.http.put<any>( `${this.urlEndpoint}/${cliente.id}`, cliente, {headers: this.httpHeaders} ).pipe(
      catchError(e =>{
        if(e.status = 400){
          return throwError(e);
        }
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    )
  }

  delete(id : number): Observable<Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndpoint}/${id}`, {headers: this.httpHeaders}).pipe(
      catchError(e =>{
        console.error(e.error.mensaje);
        Swal.fire(e.error.mensaje, e.error.error, 'error');
        return throwError(e);
      })
    )

  }
}
