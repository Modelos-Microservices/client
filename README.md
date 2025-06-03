# Client - Sistema de Gestión Angular 19

Este proyecto fue generado usando [Angular CLI](https://github.com/angular/angular-cli) versión 19.0.2.

## ⚠️⚠️ ADVERTENCIA ⚠️⚠️

Para poder usar la aplicación primero debe correr los microservicios debido a que 
necesita una validación de keycloack para mostrar la app, de lo contrario si quiere simplemente ver
las interfaces sin lo funcional de los microservicios puede ir al main.ts y descomentar el código que está
comentado y comentar el código que está funcionando para inhabilitar esa validación de Keycloack.

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

- **Node.js** (versión 18 o superior) - [Descargar aquí](https://nodejs.org/)
- **npm** (viene incluido con Node.js) o **yarn**
- **Git** - [Descargar aquí](https://git-scm.com/)
- **Angular CLI** (versión 19 o superior)

## Stripe

Para que funcione Stripe primero debemos hacer lo siguiente:

- **hookdeck** instalar hookdeck -[documentación](https://hookdeck.com/docs/cli#installation)
- abrir una terminal para iniciar sesión colocando el siguiente comando:
hookdeck login
se abrira la página donde las credenciales para iniciar sesión son:
modelosudenar@gmail.com
Caster57/
**en caso de no aceptar el login, loguearse con google y ahí colocar las credenciales**
- abrir una terminal y escribir el siguiente comando:
hookdeck listen 3003 stripe-to-localhost

## 📊 Metabase (Dashboards)

Para que el dashboard integrado funcione correctamente, **debes tener el servidor de Metabase en ejecución**.  
El frontend obtiene el dashboard embebido desde Metabase, por lo que si Metabase no está activo, la vista del dashboard no cargará.

### ¿Cómo abrir Metabase?

1. **Asegúrate de tener Metabase instalado y configurado por eso le pasó el link de la carpeta con el dashboard y mis credenciales**  
   despues de descomprimir la carpeta de esa parte del directoio abre una terminal y escribe:

   ```bash
   java -jar metabase.jar
   ```

   Esto levantará Metabase en el puerto **3100** de tu máquina local.

2. **Accede a Metabase**  
   Abre tu navegador y ve a:  
   [http://localhost:3100](http://localhost:3100)

3. **Configura tus dashboards**  
   - Ingresa con tus credenciales de administrador.
   - las credenciales están en el env.txt de la carpeta comprimida
   - Crea o verifica que exista el dashboard con el ID que usa tu frontend (por defecto, el ejemplo usa el dashboard con ID `98`).
   - Asegúrate de que los datos y permisos estén correctamente configurados.

4. **Mantén Metabase corriendo**  
   No cierres el contenedor ni la aplicación de Metabase mientras uses el dashboard embebido en el frontend.

---

**Resumen:**  
- El dashboard de la aplicación solo funcionará si Metabase está activo.
- Accede a [http://localhost:3100](http://localhost:3100) para administrar tus dashboards.


### Verificar versiones instaladas:
```bash
node --version
npm --version
git --version
```

## 🚀 Instalación

### 1. Clonar el repositorio
```bash
git clone [https://github.com/Modelos-Microservices/client]
cd client
```

### 2. Instalar Angular CLI globalmente (si no lo tienes)
```bash
npm install -g @angular/cli@19
```

### 3. Instalar dependencias del proyecto
```bash
npm install
```

### 4. Verificar que Angular CLI esté actualizado
```bash
ng version
```

## 🏃‍♂️ Ejecutar el proyecto

### Servidor de desarrollo
Para iniciar el servidor de desarrollo local:

```bash
ng serve
```

Navega a `http://localhost:4200/`. La aplicación se recargará automáticamente cuando modifiques los archivos fuente.

### Otras opciones de ejecución:
```bash
# Ejecutar en un puerto específico
ng serve --port 4300

# Ejecutar y abrir automáticamente en el navegador
ng serve --open

# Ejecutar en modo producción
ng serve --configuration production
```

## 🔧 Scripts disponibles

```bash
# Ejecutar servidor de desarrollo
npm start

# Construir para producción
npm run build

# Ejecutar tests unitarios
npm run test

# Construir y observar cambios
npm run watch
```

## 🏗️ Construcción del proyecto

Para construir el proyecto ejecuta:

```bash
ng build
```

Los archivos de construcción se almacenarán en el directorio `dist/client`. Por defecto, la construcción de producción optimiza tu aplicación para rendimiento y velocidad.

### Construcción para producción:
```bash
ng build --configuration production
```

## 🧪 Testing

### Tests unitarios
Para ejecutar tests unitarios con [Karma](https://karma-runner.github.io):

```bash
ng test
```

### Tests end-to-end
Para testing e2e:

```bash
ng e2e
```

Angular CLI no incluye un framework de testing e2e por defecto. Puedes elegir el que mejor se adapte a tus necesidades.

## 🐳 Docker

### Desarrollo con Docker
```bash
# Construir y ejecutar contenedor de desarrollo
docker-compose up --build

# Ejecutar en segundo plano
docker-compose up -d

# Ver logs
docker-compose logs -f angular-dev

# Parar contenedores
docker-compose down
```

### Producción con Docker
```bash
# Construir imagen para producción
docker build -t angular-app .

# Ejecutar contenedor de producción
docker run -p 8080:80 angular-app
```

La aplicación estará disponible en:
- **Desarrollo**: `http://localhost:4200`
- **Producción**: `http://localhost:8080`

## 📦 Dependencias principales

### Dependencias de producción:
- **Angular 19**: Framework principal
- **PrimeNG**: Biblioteca de componentes UI
- **Tailwind CSS**: Framework de utilidades CSS
- **Keycloak**: Autenticación y autorización
- **RxJS**: Programación reactiva
- **NgxToastr**: Notificaciones toast

### Dependencias de desarrollo:
- **Angular CLI**: Herramientas de desarrollo
- **TypeScript**: Superset de JavaScript
- **Karma**: Test runner
- **Jasmine**: Framework de testing

## 🛠️ Scaffolding de código

Angular CLI incluye herramientas de scaffolding. Para generar un nuevo componente:

```bash
ng generate component nombre-componente
```

### Otros comandos útiles:
```bash
# Generar servicio
ng generate service nombre-servicio

# Generar módulo
ng generate module nombre-modulo

# Generar guardia
ng generate guard nombre-guardia

# Ver lista completa de opciones
ng generate --help
```

## 📁 Estructura del proyecto

```
src/
├── app/
│   ├── core/                 # Servicios principales y guardias
│   ├── features/            # Módulos de funcionalidades
│   │   ├── auth/           # Autenticación
│   │   ├── products/       # Gestión de productos
│   │   ├── cart/           # Carrito de compras
│   │   └── debts/          # Gestión de deudas
│   ├── shared/             # Componentes compartidos
│   └── ...
├── assets/                 # Recursos estáticos
├── environments/           # Configuraciones de entorno
└── styles.scss            # Estilos globales
```

## 🔧 Configuración del entorno

### Variables de entorno
Crea los archivos de configuración necesarios:

```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  keycloak: {
    url: 'http://localhost:8080',
    realm: 'your-realm',
    clientId: 'your-client'
  }
};
```

### Configuración de desarrollo
1. Configura tu servidor backend
2. Ajusta las URLs en los archivos de environment
3. Configura Keycloak si usas autenticación

## 🚨 Solución de problemas comunes

### Error: "ng command not found"
```bash
npm install -g @angular/cli@19
```

### Error de dependencias
```bash
# Limpiar caché de npm
npm cache clean --force

# Eliminar node_modules y reinstalar
rm -rf node_modules package-lock.json
npm install
```

### Error de presupuesto (budget) en build
El proyecto está configurado con límites de presupuesto. Si necesitas aumentarlos, modifica `angular.json`:

```json
"budgets": [
  {
    "type": "initial",
    "maximumWarning": "2mb",
    "maximumError": "5mb"
  }
]
```

### Puerto en uso
```bash
# Usar un puerto diferente
ng serve --port 4300

# O matar el proceso en el puerto 4200
npx kill-port 4200
```

## 📚 Recursos adicionales

- [Documentación de Angular](https://angular.dev)
- [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli)
- [PrimeNG Documentation](https://primeng.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Keycloak Documentation](https://www.keycloak.org/documentation)

## 🤝 Contribución

1. Fork el proyecto
2. Crea tu feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la branch (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT - ve el archivo [LICENSE.md](LICENSE.md) para detalles.

## 👨‍💻 Autor

**Nicky, Gsus y el loco Medina**
- GitHub: [@DivergenteNM](https://github.com/DivergenteNM)
- Email: nicolasmdivergent@gmail.com.com

---

⭐ ¡No olvides dar una estrella al proyecto si te resulta útil!