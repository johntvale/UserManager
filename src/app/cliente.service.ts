import { Injectable } from '@angular/core';
import { Cliente } from './cadastro/Cliente';

@Injectable({
  providedIn: 'root'
})

export class ClienteService {

  static REPO_CLIENTES = '_CLIENTES';

  constructor() { }

  buscarClientes(nome: string) {
    const clientes = this.obterStorage();
    const clientesFiltrados = clientes.filter(
      cliente => cliente.nome?.toLowerCase().includes(nome.toLowerCase())
    );
    return clientesFiltrados;
  }

  pesquisarID(id: string): Cliente | undefined {    
    const clientesFiltrados = this.obterStorage();
    return clientesFiltrados.find(cliente=> cliente.id === id);
  }

  salvar(cliente: Cliente) {
    const clientesStorage = this.obterStorage();
    clientesStorage.push(cliente);
    localStorage.setItem(ClienteService.REPO_CLIENTES, JSON.stringify(clientesStorage));
  }

  atualizar(Cliente: Cliente) {
    const clientesStorage = this.obterStorage();
    clientesStorage.forEach( c => {
      if (c.id === Cliente.id) {
        Object.assign(c, Cliente);
        localStorage.setItem(ClienteService.REPO_CLIENTES, JSON.stringify(clientesStorage));
      }      
    });
  }

  editar(cliente: Cliente) {
    const clientesStorage = this.obterStorage();
    const index = clientesStorage.findIndex((clienteStorage: Cliente) => clienteStorage.id === cliente.id);
    clientesStorage[index] = cliente;
    localStorage.setItem(ClienteService.REPO_CLIENTES, JSON.stringify(clientesStorage));
  }

  remover(id: string) {    
    const clientesStorage = this.obterStorage();
    const listaFiltrada = clientesStorage.filter(clienteStorage => clienteStorage.id !== id);
    localStorage.setItem(ClienteService.REPO_CLIENTES, JSON.stringify(listaFiltrada));
  }

  private obterStorage(): Cliente[] {
    const storageClientes = localStorage.getItem(ClienteService.REPO_CLIENTES);

    if(!storageClientes) {
      const clientes: Cliente[] = [];
      localStorage.setItem(ClienteService.REPO_CLIENTES, JSON.stringify(clientes));
      return clientes;
    }

    const clientes = JSON.parse(storageClientes);
    return clientes;
  }
}
