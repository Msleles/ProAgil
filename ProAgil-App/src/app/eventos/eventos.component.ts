import { Component, OnInit, TemplateRef } from '@angular/core';
import { Evento } from '../_models/Evento';
import { EventoService } from '../_services/evento.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {FormControl, FormGroup, Validators} from '@angular/forms';




@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css']
})
export class EventosComponent implements OnInit {

  eventosFiltrados: Evento[] = [];
  eventos: Evento[] = [];
  imagemLargura = 50;
  imagemMargem = 2;
  mostrarImagem = false;
  modalRef: BsModalRef | any ;
  registerForm: FormGroup | any;



  // tslint:disable-next-line:variable-name
  _filtroLista = '';

  constructor(private eventoService: EventoService, private modalService: BsModalService ) { }


  get filtroLista(): string {
    return this._filtroLista;
  }
  set filtroLista(value: string) {
    this._filtroLista = value;
    this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.eventos;
  }

  openModal(template: TemplateRef<any>){
    this.modalRef = this.modalService.show(template);
  }


  ngOnInit() {
    this.validation();
    this.getEventos();
  }

  filtrarEventos(filtrarPor: string): Evento[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    return this.eventos.filter(
      evento => evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1
    );
  }

  alternarImagem() {
    this.mostrarImagem = !this.mostrarImagem;
  }

  validation(){
    this.registerForm = new FormGroup({
      tema: new FormControl('',
      [Validators.required, Validators.minLength(4), Validators.maxLength(50)]),
      local: new FormControl('', Validators.required),
      dataEvento: new FormControl('', Validators.required),
      ImagemURL : new FormControl('', Validators.required),
      qtdPessoas: new FormControl('', [Validators.required , Validators.max(1200000)]),
      email: new FormControl('', [Validators.required, Validators.email])
    });
  }

  salvarAlteracao(){

  }

  getEventos() {
    this.eventoService.getAllEvento().subscribe(
      (eventos: Evento[]) => {
      this.eventos = eventos;
      console.log(eventos);
    }, error => {
      console.log(error);
    });
  }
}
