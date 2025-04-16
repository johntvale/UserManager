import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input'
import { MatCardModule } from '@angular/material/card'
import { MatIconModule } from '@angular/material/icon'
import { MatTableModule } from '@angular/material/table'
import { MatButtonModule } from '@angular/material/button'
import { MatSnackBar } from '@angular/material/snack-bar'
import { FlexLayoutModule } from '@angular/flex-layout'
import { FormsModule } from '@angular/forms'
import { ClienteService } from '../cliente.service';
import { Cliente } from '../cadastro/Cliente';
import { Router } from '@angular/router';


@Component({
  selector: 'app-consulta',
  imports: [
    FlexLayoutModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    FormsModule,
    CommonModule,
  ],
  templateUrl: './consulta.component.html',
  styleUrl: './consulta.component.scss'
})
export class ConsultaComponent {

  nomeFiltro: string = '';
  listaClientes: Cliente[] = [];
  colunasTable: string[] = ['id', 'nome', 'cpf', 'dataNascimento', 'email', 'estado', 'municipio', 'acoes'];
  delentando: boolean = false;
  clienteIdDeletar = '';
  snack: MatSnackBar = inject(MatSnackBar);

  constructor(private service: ClienteService, private router: Router) {}

  ngOnInit() {
    this.listaClientes = this.service.buscarClientes('');
  }

  pesquisar(){
    this.listaClientes = this.service.buscarClientes(this.nomeFiltro);
  }
  
  limparFiltro(){
    this.nomeFiltro = '';
    this.listaClientes = this.service.buscarClientes('');
  }

  prepararEditar(id: string){
    this.router.navigate(['/cadastro'], { queryParams: { id: id } });
    this.delentando = false;
    this.clienteIdDeletar = '';
  }

  preparaDeletar(id: string){
    this.delentando = true;
    this.clienteIdDeletar = id;
  }

  cancelarDeletar(){
    this.delentando = false;
    this.clienteIdDeletar = '';
  }

  deletar(id: string){
    this.service.remover(id);
    this.delentando = false
    this.openSnackBar("Cliente deletado com sucesso!", "Fechar");
  }

  openSnackBar(message: string, action: string) {
    this.snack.open(message, action, {
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
    });
  }
}
