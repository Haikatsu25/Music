/**
 * Límite de peticiones por clave (IP) en memoria. Suficiente para un portafolio:
 * en entornos serverless se reinicia por instancia.
 */
export function crearLimitador({ max, ventanaMs }: { max: number; ventanaMs: number }) {
  const registros = new Map<string, number[]>();

  return function permitir(clave: string, ahora: number = Date.now()): boolean {
    const recientes = (registros.get(clave) ?? []).filter((t) => ahora - t < ventanaMs);
    if (recientes.length >= max) {
      registros.set(clave, recientes);
      return false;
    }
    recientes.push(ahora);
    registros.set(clave, recientes);
    return true;
  };
}
