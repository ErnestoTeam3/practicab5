// Este archivo asegura que Socket.IO esté disponible globalmente

export function ensureSocketIO() {
  if (typeof window !== "undefined") {
    return; // No hacer nada en el cliente
  }

  // En el servidor, si Socket.IO no está inicializado, intenta obtenerlo
  if (!(global as any).io) {
    console.warn("⚠️ Socket.IO aún no está inicializado. Intenta inicializarlo.");
    
    // Forzar inicialización accediendo a la ruta de socket
    // Esto solo funciona si ya hay una conexión hecha
  }
}

// Esperar a que Socket.IO esté listo
export async function waitForSocketIO(maxRetries = 50) {
  let retries = 0;

  while (!(global as any).io && retries < maxRetries) {
    await new Promise((resolve) => setTimeout(resolve, 100));
    retries++;
  }

  if (!(global as any).io) {
    console.error("❌ Socket.IO no pudo inicializarse después de varios intentos");
    return false;
  }

  console.log("✅ Socket.IO está listo");
  return true;
}