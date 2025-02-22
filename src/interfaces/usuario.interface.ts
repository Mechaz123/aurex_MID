import { EstadoUsuario } from "./estado_usuario.interface";

export interface Usuario {
    id: number;
    nombre_usuario: string;
    correo: string;
    clave: string;
    nombre: string;
    apellido: string;
    direccion: string;
    numero_contacto: string;
    pais: string;
    imagen_url: string;
    fecha_creacion: Date;
    fecha_actualizacion: Date;
    estado_usuario: EstadoUsuario;
}