import { Alert } from "../types/alerts";

export const mockAlerts: Alert[] = [
  { id: 1, title: "Mantenimiento pendiente", message: "Revisión de maquinaria en 2 días.", type: "warning", date: "2024-06-01" },
  { id: 2, title: "Aviso de seguridad", message: "Nueva normativa de seguridad aplicada.", type: "info", date: "2024-05-28" },
  { id: 3, title: "Fallo en línea de producción", message: "Producción detenida en sector 3.", type: "error", date: "2024-05-27" },
];
