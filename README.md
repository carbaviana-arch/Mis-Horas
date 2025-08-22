# ⏱️ Registro de Horas (PWA)

Aplicación web progresiva (PWA) para registrar horas de entrada y salida en el trabajo, con resumen diario y semanal.  
Funciona sin conexión, permite modo oscuro y se puede instalar en dispositivos móviles como una app nativa.

---

## 🚀 Características
- Registro de **hora de entrada y salida**.
- Cálculo automático del **total de horas trabajadas**.
- **Historial de registros** con opción de eliminar.
- **Resumen por día y semana**.
- **Modo oscuro** con interruptor (switch).
- Se instala como **PWA** (funciona offline y se añade a la pantalla de inicio).
- **Cache busting** implementado para que siempre se actualice a la última versión.

---

## 📂 Estructura del proyecto
/
├── index.html
├── style.css
├── script.js
├── manifest.json
├── service-worker.js
├── icon-192.png
├── icon-512.png
└── README.md

---

## 🔧 Instalación y ejecución

### 1. Clonar el repositorio
```bash
git clone https://github.com/tuusuario/registro-horas.git
cd registro-horas