export type Prioritat = 'baixa' | 'mitja' | 'alta' | 'crítica';
export type Estat = 'oberta' | 'assignada' | 'solucionada' | 'tancada';

export interface Incidencia {
  _id?: string;
  titulo: string;
  descripcion: string;
  imagenUrl?: string;
  prioridad: 'baixa' | 'mitja' | 'alta' | 'crítica';
  estado: 'oberta' | 'assignada' | 'solucionada' | 'tancada';
  usuarioCreador: string;
  fechaCreacion: Date;
  tecnico?: string;
  solucion?: string;
  fechaSolucion?: Date;
}
