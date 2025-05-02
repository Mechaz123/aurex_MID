import { Injectable } from '@nestjs/common';
import { UtilsService } from './utils.service';
import { Subasta } from 'src/interfaces/subasta.interface';
import { EstadoSubasta } from 'src/interfaces/estado_subasta.interface';
import { Puja } from 'src/interfaces/puja.interface';
import { Credito } from 'src/interfaces/credito.interface';
import { EmailService } from './email.service';

@Injectable()
export class SubastaService {
    constructor(
        private readonly utilsService: UtilsService,
        private readonly emailService: EmailService
    ) { }

    async SubastasPropietario(id: string, token: string): Promise<any> {
        const headers = { Authorization: `Bearer ${token}` };
        const todosSubasta = await this.utilsService.SendGet<Subasta[]>(process.env.AUREX_MID_AUREX_CRUD_URL, "subasta", headers);

        if (todosSubasta) {
            const subastasPropietario = todosSubasta.filter(subasta => (subasta.producto.propietario.id == Number(id)));
            const todasPujasSubasta = await this.utilsService.SendGet<Puja[]>(process.env.AUREX_MID_AUREX_CRUD_URL, "puja", headers);

            if (todasPujasSubasta) {
                for (const subasta of subastasPropietario) {
                    const pujas = todasPujasSubasta.filter(puja => (puja.subasta.id == subasta.id));
                    (subasta as any).pujas = pujas;
                }
            }
            return subastasPropietario as any[];
        } else {
            throw new Error("No se pudo consultar las subastas.");
        }
    }

    async Comprobar(token: string) {
        const headers = { Authorization: `Bearer ${token}` };
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

                        if (subastaActualizada) {
                            const TodosCredito = await this.utilsService.SendGet<Credito[]>(process.env.AUREX_MID_AUREX_CRUD_URL, `credito`, headers);
                            const TodosPujas = await this.utilsService.SendGet<Puja[]>(process.env.AUREX_MID_AUREX_CRUD_URL, `puja`, headers);

                            if (TodosCredito && TodosPujas) {
                                const PujasSubasta = TodosPujas.filter(puja => (puja.subasta.id == subastaActualizada.id));

                                if (Object.keys(PujasSubasta).length > 0) {
                                    const ultimaPuja = TodosPujas.find(puja => (puja.subasta.id == subastaActualizada.id) && (puja.activo));
                                    let creditoComprador = TodosCredito.find(credito => (credito.usuario.id == ultimaPuja.usuario.id));
                                    creditoComprador.monto = Number(creditoComprador.monto) - Number(subastaActualizada.precio_actual);
                                    const creditoCompradorActualizado = await this.utilsService.SendPut<Credito, Credito>(process.env.AUREX_MID_AUREX_CRUD_URL, `credito/${creditoComprador.id}`, creditoComprador, headers);

                                    if (creditoCompradorActualizado) {
                                        let creditoVendedor = TodosCredito.find(credito => (credito.usuario.id == subastaActualizada.producto.propietario.id));
                                        creditoVendedor.monto = Number(creditoVendedor.monto) + Number(subastaActualizada.precio_actual);
                                        const creditoVendedorActualizado = await this.utilsService.SendPut<Credito, Credito>(process.env.AUREX_MID_AUREX_CRUD_URL, `credito/${creditoVendedor.id}`, creditoVendedor, headers);

                                        if (creditoVendedorActualizado) {
                                            const dataGanador = {
                                                "nombre_producto": subastaActualizada.producto.nombre,
                                                "valor_subasta": subastaActualizada.precio_actual
                                            }

                                            await this.emailService.EnviarEmail(ultimaPuja.usuario.correo, "GANADOR DE LA SUBASTA", dataGanador);

                                            const dataVendedor = {
                                                "nombre_producto": subastaActualizada.producto.nombre,
                                                "valor_subasta": subastaActualizada.precio_actual,
                                                "entrega": ultimaPuja.usuario.direccion
                                            }

                                            await this.emailService.EnviarEmail(subastaActualizada.producto.propietario.correo, "ENTREGAR PRODUCTO DE SUBASTA", dataVendedor);
                                        } else {
                                            throw new Error("No se actualizar el credito del vendedor.");
                                        }
                                    } else {
                                        throw new Error("No se actualizar el credito del comprador.");
                                    }
                                }
                            } else {
                                throw new Error("No se pudo consultar los creditos o las pujas.");
                            }
                        } else {
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
        const headers = { Authorization: `Bearer ${token}` };
        const todosSubasta = await this.utilsService.SendGet<Partial<Subasta[]>>(process.env.AUREX_MID_AUREX_CRUD_URL, "subasta", headers);

        if (todosSubasta) {
            const subastasActivas = todosSubasta.filter(subasta => (subasta.estado_subasta.nombre == "Activa"));
            const todasPujasSubasta = await this.utilsService.SendGet<Puja[]>(process.env.AUREX_MID_AUREX_CRUD_URL, "puja", headers);

            if (todasPujasSubasta) {
                for (const subasta of subastasActivas) {
                    const pujas = todasPujasSubasta.filter(puja => (puja.subasta.id == subasta.id));
                    (subasta as any).pujas = pujas;
                }
            }
            return subastasActivas as any[];
        } else {
            throw new Error("No se pudo consultar las subastas.");
        }
    }

    async RegistrarPuja(body: any, token: string) {
        const headers = { Authorization: `Bearer ${token}` };
        const todosPujas = await this.utilsService.SendGet<Puja[]>(process.env.AUREX_MID_AUREX_CRUD_URL, "puja", headers);

        if (todosPujas) {
            const pujasSubasta = todosPujas.filter(puja => (puja.subasta.id == body.subasta.id));

            if (Object.keys(pujasSubasta).length == 0) {
                const responsePujaCreada = await this.utilsService.SendPost<Puja, Partial<Puja>>(process.env.AUREX_MID_AUREX_CRUD_URL, "puja", body, headers);

                if (responsePujaCreada) {
                    let subasta = await this.utilsService.SendGet<Subasta>(process.env.AUREX_MID_AUREX_CRUD_URL, `subasta/${body.subasta.id}`, headers);

                    if (subasta) {
                        subasta.precio_actual = body.monto;
                        const responseSubastaActualizado = await this.utilsService.SendPut<Subasta, Subasta>(process.env.AUREX_MID_AUREX_CRUD_URL, `subasta/${body.subasta.id}`, subasta, headers);

                        if (!responseSubastaActualizado) {
                            throw new Error("No se pudo actualizar la subasta.");
                        }
                    } else {
                        throw new Error("No se pudo obtener la subasta.");
                    }
                } else {
                    throw new Error("No se pudo registrar la puja.");
                }
            } else {
                let ultimaPuja = pujasSubasta.find(puja => (puja.activo));
                ultimaPuja.activo = false;

                const ultmimaPujaActualizada = await this.utilsService.SendPut<Puja, Puja>(process.env.AUREX_MID_AUREX_CRUD_URL, `puja/${ultimaPuja.id}`, ultimaPuja, headers);

                if (ultmimaPujaActualizada) {
                    const responsePujaCreada = await this.utilsService.SendPost<Puja, Partial<Puja>>(process.env.AUREX_MID_AUREX_CRUD_URL, "puja", body, headers);

                    if (responsePujaCreada) {
                        let subasta = await this.utilsService.SendGet<Subasta>(process.env.AUREX_MID_AUREX_CRUD_URL, `subasta/${body.subasta.id}`, headers);

                        if (subasta) {
                            subasta.precio_actual = body.monto;
                            const responseSubastaActualizado = await this.utilsService.SendPut<Subasta, Subasta>(process.env.AUREX_MID_AUREX_CRUD_URL, `subasta/${body.subasta.id}`, subasta, headers);

                            if (!responseSubastaActualizado) {
                                throw new Error("No se pudo actualizar la subasta.");
                            }
                        } else {
                            throw new Error("No se pudo obtener la subasta.");
                        }
                    } else {
                        throw new Error("No se pudo registrar la puja.");
                    }
                } else {
                    throw new Error("No se pudo actualizar la última puja activa.");
                }
            }
        } else {
            throw new Error("No se pudo obtener todas las pujas.");
        }



    }
}
