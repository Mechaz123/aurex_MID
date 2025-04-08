import { Injectable } from '@nestjs/common';
import { UtilsService } from './utils.service';
import { Subasta } from 'src/interfaces/subasta.interface';
import { EstadoSubasta } from 'src/interfaces/estado_subasta.interface';
import { Puja } from 'src/interfaces/puja.interface';

@Injectable()
export class SubastaService {
    constructor(
        private readonly utilsService: UtilsService
    ) { }

    async Comprobar(token: string) {
        const headers = { Authorization: `Bearer ${token}`};
        const todosSubasta = await this.utilsService.SendGet<Subasta[]>(process.env.AUREX_MID_AUREX_CRUD_URL, "subasta", headers);
        const todosEstadoSubasta = await this.utilsService.SendGet<EstadoSubasta[]>(process.env.AUREX_MID_AUREX_CRUD_URL, "estado_subasta", headers);
        const tiempoActual = new Date();

        if (todosSubasta && todosEstadoSubasta) {
            for (let subasta of todosSubasta) {
                if (subasta.estado_subasta.nombre == "Creada") {
                    if (tiempoActual > new Date(subasta.fecha_inicio) && tiempoActual < new Date(subasta.fecha_fin)) {
                        const estadoSubastaActiva = todosEstadoSubasta.find(estadoSubasta => estadoSubasta.nombre == "Activa");
                        subasta.estado_subasta = estadoSubastaActiva;
                        const subastaActualizada = await this.utilsService.SendPut<Subasta, Subasta>(process.env.AUREX_MID_AUREX_CRUD_URL, `subasta/${subasta.id}`, subasta, headers);
    
                        if (!subastaActualizada) {
                            throw new Error("No se pudo actualizar la subasta.");
                        }
                    }
                } else if (subasta.estado_subasta.nombre == "Activa") {
                    if (tiempoActual > new Date(subasta.fecha_fin)) {
                        const estadoSubastaFinalizada = todosEstadoSubasta.find(estadoSubasta => estadoSubasta.nombre == "Finalizada");
                        subasta.estado_subasta = estadoSubastaFinalizada;
                        const subastaActualizada = await this.utilsService.SendPut<Subasta, Subasta>(process.env.AUREX_MID_AUREX_CRUD_URL, `subasta/${subasta.id}`, subasta, headers);
    
                        if (!subastaActualizada) {
                            throw new Error("No se pudo actualizar la subasta.");
                        }
                    }
                }
            }
        } else {
            throw new Error("No se pudo consultar las subastas o los estados de subasta.");
        }
    }

    async SubastasActivas(token: string): Promise<any[]> {
        const headers = { Authorization: `Bearer ${token}`};
        const todosSubasta = await this.utilsService.SendGet<Partial<Subasta[]>>(process.env.AUREX_MID_AUREX_CRUD_URL, "subasta", headers);

        if (todosSubasta) {
            const subastasActivas = todosSubasta.filter(subasta => (subasta.estado_subasta.nombre == "Activa"));
            const todasPujasSubasta = await this.utilsService.SendGet<Puja[]>(process.env.AUREX_MID_AUREX_CRUD_URL, "puja", headers);

            if (todasPujasSubasta) {
                for (const subasta of subastasActivas) {
                    const pujas = todasPujasSubasta.filter(puja => (puja.subasta == subasta));
                    (subasta as any).pujas = pujas;
                }
            }
            return subastasActivas as any[];
        } else {
            throw new Error("No se pudo consultar las subastas.");
        }
    }
}
