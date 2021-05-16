import { Component, OnInit, TemplateRef } from '@angular/core';
import { Evento } from '../_models/Evento';
import { EventoService } from '../_services/evento.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import { defineLocale , ptBrLocale } from 'ngx-bootstrap/chronos';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
defineLocale('pt-br', ptBrLocale);




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
  file: File | any;
  fileNameToUpdate: string | any;



  // tslint:disable-next-line:variable-name
  _filtroLista = '';

  constructor(
    private eventoService: EventoService,
    private modalService: BsModalService ,  private fb: FormBuilder , private localeService: BsLocaleService
    ) {
      this.localeService.use('pt-br');
    }




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
    this.registerForm = this.fb.group({
      tema: ['',
      [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      local: ['', Validators.required],
      dataEvento: ['', Validators.required],
      ImagemURL : ['', Validators.required],
      qtdPessoas: ['', [Validators.required , Validators.max(1200000)]],
      telefone : ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onFileChange(event) {
    const reader = new FileReader();

    if (event.target.files && event.target.files.length) {
      this.file = event.target.files;
      console.log(this.file);
    }
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
