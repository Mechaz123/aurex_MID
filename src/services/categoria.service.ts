import { Injectable } from '@nestjs/common';
import { Categoria } from 'src/interfaces/categoria.interface';
import { UtilsService } from './utils.service';

@Injectable()
export class CategoriaService {
    constructor(
        private readonly utilsService: UtilsService
    ) { }

    async CategoriasPrincipales(token: string): Promise<Categoria[]> {
        const headers = { Authorization: `Bearer ${token}`};
        const todasCategorias = await this.utilsService.SendGet<Categoria[]>(process.env.AUREX_MID_AUREX_CRUD_URL, "categoria", headers);
        const categoriasPrincipales = todasCategorias.filter(categoria => (categoria.categoria_principal == null) && categoria.activo).sort((a, b) => a.nombre.localeCompare(b.nombre));
        return categoriasPrincipales;
    }

    async CategoriasSecundarias(token: string): Promise<Categoria[]> {
        const headers = { Authorization: `Bearer ${token}`};
        const todasCategorias = await this.utilsService.SendGet<Categoria[]>(process.env.AUREX_MID_AUREX_CRUD_URL, "categoria", headers);
        const categoriasSecundarias = todasCategorias.filter(categoria => (categoria.categoria_principal != null) && categoria.activo).sort((a, b) => a.nombre.localeCompare(b.nombre));
        return categoriasSecundarias;
    }
}
