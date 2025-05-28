export interface Incidencia {
  id?: string;
  titulo: string;
  descripcion: string;
  imagenUrl?: string;
  prioridad: 'baixa' | 'mitja' | 'alta' | 'crítica';
  estado: 'oberta' | 'assignada' | 'solucionada' | 'tancada';
  usuarioCreador: string;
  fechaCreacion: Date;
  usuarioAsignado?: string;
  solucion?: string;
  fechaSolucion?: Date;
}
