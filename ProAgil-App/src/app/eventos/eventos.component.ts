import { Component, OnInit } from '@angular/core';
import { Evento } from '../_models/Evento';
import { EventoService } from '../_services/evento.service';
import { BsModalService } from 'ngx-bootstrap/modal';
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

  eventosFiltrados: Evento[] | undefined;

  evento: Evento[] | any ;
  eventos: Evento[] | any;
  imagemLargura = 50;
  imagemMargem = 2;
  mostrarImagem = false;
  registerForm: FormGroup | any;
  file: File | any;
  fileNameToUpdate: string | any;
  modoSalvar = 'post';
  dataAtual: string | undefined;
  bodyDeletarEvento = '';





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
      this.eventosFiltrados = this.filtroLista ? this.filtrarEventos(this.filtroLista) : this.evento;
    }



  editarEvento(evento: Evento, template: any) {
    this.modoSalvar = 'put';
    this.openModal(template);
    this.evento = evento;
    this.registerForm.patchValue(this.evento);

    
  }

  novoEvento(template: any) {
    this.modoSalvar = 'post';
    this.openModal(template);
  }

  openModal(template: any){
    this.registerForm.reset();
    template.show();
  }


  ngOnInit() {
    this.validation();
    this.getEventos();
  }

  public filtrarEventos(filtrarPor: string): Evento[] {
    filtrarPor = filtrarPor.toLocaleLowerCase();
    if (!this.evento){
      return[];
    }else{
      return this.eventos.filter(
        evento => {
          return evento.tema.toLocaleLowerCase().indexOf(filtrarPor) !== -1 || evento.toLocaleLowerCase().indexOf(filtrarPor) !== -1;
        }
      );
    }
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


  uploadImagem() {
    if (this.modoSalvar === 'post') {
      const nomeArquivo = this.evento.imagemURL.split('\\', 3);
      this.evento.imagemURL = nomeArquivo[2];

      this.eventoService.postUpload(this.file, nomeArquivo[2])
        .subscribe(
          () =>  {
            this.dataAtual = new Date().getMilliseconds().toString();
            this.getEventos();
          }
        );
    } else {
      this.evento.imagemURL = this.fileNameToUpdate;
      this.eventoService.postUpload(this.file, this.fileNameToUpdate)
        .subscribe(
          () =>  {
            this.dataAtual = new Date().getMilliseconds().toString();
            this.getEventos();
          }
        );
    }
  }

  excluirEvento(evento: Evento, template: any) {
    this.openModal(template);
    this.evento = evento;
    this.bodyDeletarEvento = `Tem certeza que deseja excluir o Evento: ${evento.tema}, Código: ${evento.id}`;
  }

  confirmeDelete(template: any) {
    this.eventoService.deleteEvento(this.evento.id).subscribe(
      () => {
        template.hide();
        this.getEventos();
      }, error => {
        console.log(error);
      }
    );
  }

  salvarAlteracao(template: any){
    if (this.registerForm.valid) {
      if (this.modoSalvar === 'post'){
        this.evento = Object.assign({}, this.registerForm.value);
        this.eventoService.postEvento(this.evento).subscribe(
          (novoEvento: Evento | any) => {
            console.log(novoEvento);
            template.hide();
            this.getEventos();
          }, error => {
            console.log(error);
          }
        );
      }else {
        this.evento = Object.assign({id: this.evento.id}, this.registerForm.value);
        this.eventoService.putEvento(this.evento).subscribe(
          () => {
            template.hide();
            this.getEventos();
          }, error => {
            console.log(error);
          }
        );
      }
    }
  }


  getEventos() {
    this.eventoService.getAllEvento().subscribe(
      (eventos: Evento[]) => {
      this.evento = eventos;
      console.log(eventos);
    }, error => {
      console.log(error);
    });
  }
}




