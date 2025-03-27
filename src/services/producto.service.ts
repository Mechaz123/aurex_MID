import { Injectable } from '@nestjs/common';
import { UtilsService } from './utils.service';
import { Producto } from 'src/interfaces/producto.interface';

@Injectable()
export class ProductoService {
    constructor(
        private readonly utilsService: UtilsService,
    ) { }

    async getProductosVenta(token: string): Promise<Producto[]> {
        const headers = { Authorization: `Bearer ${token}`};
        const todosProductos = await this.utilsService.SendGet<Producto[]>(process.env.AUREX_MID_AUREX_CRUD_URL, "producto", headers);
        const productosVenta = todosProductos.filter(producto => (producto.destino == "Venta") && (producto.estado_producto.nombre != "Inactivo"));
        return productosVenta;
    }

    async getProductosIntercambio(id: string, token: string): Promise<Producto[]> {
        const headers = { Authorization: `Bearer ${token}`};
        const todosProductos = await this.utilsService.SendGet<Producto[]>(process.env.AUREX_MID_AUREX_CRUD_URL, "producto", headers);
        const productosIntercambio = todosProductos.filter(producto => (producto.destino == "Intercambio") && (producto.estado_producto.nombre != "Inactivo") && (producto.propietario.id != Number(id)));
        return productosIntercambio;
    }

    async getProductosVentaPropietario(id: string, token: string): Promise<Producto[]> {
        const headers = { Authorization: `Bearer ${token}`};
        const todosProductos = await this.utilsService.SendGet<Producto[]>(process.env.AUREX_MID_AUREX_CRUD_URL, "producto", headers);
        const productosPropietario = todosProductos.filter(producto => ((producto.propietario.id == Number(id)) && producto.destino == 'Venta'));
        return productosPropietario;
    }

    async getProductosIntercambioPropietario(id: string, token: string): Promise<Producto[]> {
        const headers = { Authorization: `Bearer ${token}`};
        const todosProductos = await this.utilsService.SendGet<Producto[]>(process.env.AUREX_MID_AUREX_CRUD_URL, "producto", headers);
        const productosPropietario = todosProductos.filter(producto => ((producto.propietario.id == Number(id)) && producto.destino == 'Intercambio'));
        return productosPropietario; 
    }

    async getProductosSubastaPropietario(id: string, token: string): Promise<Producto[]> {
        const headers = { Authorization: `Bearer ${token}`};
        const todosProductos = await this.utilsService.SendGet<Producto[]>(process.env.AUREX_MID_AUREX_CRUD_URL, "producto", headers);
        const productosPropietario = todosProductos.filter(producto => ((producto.propietario.id == Number(id)) && producto.destino == 'Subasta'));
        return productosPropietario; 
    }

    async getProductosDonacionPropietario(id: string, token: string): Promise<Producto[]> {
        const headers = { Authorization: `Bearer ${token}`};
        const todosProductos = await this.utilsService.SendGet<Producto[]>(process.env.AUREX_MID_AUREX_CRUD_URL, "producto", headers);
        const productosPropietario = todosProductos.filter(producto => ((producto.propietario.id == Number(id)) && producto.destino == 'Donación'));
        return productosPropietario; 
    }
}
