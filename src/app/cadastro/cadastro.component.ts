import { Municipio } from './../brasilapi.model';
import { BrasilapiService } from './../brasilapi.service';
import { CommonModule } from '@angular/common';
import { Cliente } from './Cliente';
import { Component, inject, OnInit } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ClienteService } from '../cliente.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Estado } from '../brasilapi.model';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';


@Component({
  selector: 'app-cadastro',
  imports: [
    FlexLayoutModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    FormsModule,
    CommonModule,
    NgxMaskDirective,
  ], providers: [provideNgxMask()],

  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss'
})
export class CadastroComponent implements OnInit {

  cliente: Cliente = Cliente.newCliente();
  atualizando: boolean = false;
  snack: MatSnackBar = inject(MatSnackBar);
  estados: Estado[] = [];
  municipios: Municipio[] = [];

  constructor(
    private service: ClienteService,
    private BrasilapiService: BrasilapiService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.queryParamMap.subscribe(params => {
      const id = params.get('id');
        if (id) {
          const cliente = this.service.pesquisarID(id);
          if (cliente) {
            this.atualizando = true;
            this.cliente = cliente;
            if (cliente.estado) {
              const event = {
                value: cliente.estado
              };
              this.carregarMunicipios(event as MatSelectChange);
            }
          }
        }
    })

    this.carregarUFs();
  }  

  carregarUFs() {
    this.BrasilapiService.listarUFs().subscribe({
      next: (estados) => {
        this.estados = estados;
      },
      error: (error) => {
        console.error('Erro ao carregar UFs:', error);
      }
    })
  }

  carregarMunicipios(event: MatSelectChange) {
    const estadoSelecionado = event.value;
    this.BrasilapiService.listarMunicipios(estadoSelecionado).subscribe({
      next: (municipios) => {
        this.municipios = municipios;
      },
      error: (error) => {
        console.error('Erro ao carregar Municipios:', error);
      }
    })
  }

  atualizar() {
    this.service.atualizar(this.cliente);
    this.limparForm();
    this.cliente = Cliente.newCliente();
    this.router.navigate(['/consulta']);
    this.atualizando = false;
    this.openSnackBar("Cliente atualizado com sucesso!", "Fechar");
  }

  salvar() {
    this.service.salvar(this.cliente);
    this.limparForm();
    this.cliente = Cliente.newCliente();
    this.openSnackBar("Cliente criado com sucesso!", "Fechar");
  }

  submitForm() {
    this.route.queryParamMap.subscribe(params => {
      const id = params.get('id');

      if (id) {
        this.atualizar()
      } else {
        this.salvar()
      }
    })
  }

  limparForm() {
    this.cliente = {
      nome: '',
      email: '',
      cpf: '',
      dataNascimento: '',
      estado: '',
      municipio: ''
    }
  }

  openSnackBar(message: string, action: string) {
    this.snack.open(message, action, {
      duration: 4000,
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
    });
  }
}
