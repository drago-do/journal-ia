# Journal IA

"Journal-IA" es una plataforma en línea para la revisión y publicación de artículos científicos de estudiantes. Los trabajos son evaluados por revisores expertos y una inteligencia artificial potenciada por OpenIA. Los administradores toman la decisión final sobre la publicación. Fomentamos la excelencia académica y la interacción colaborativa.
## Requisitos previos

Asegúrate de tener instalados los siguientes requisitos previos en tu máquina:

- Node.js (v16.20.0)
- npm (8.19.2)
- MongoDB (mongoAtlas) --puede ser otra version--

## Instalación

1. Clona el repositorio en tu máquina local:

```bash
git clone https://github.com/drago-do/journal-ia.git
```
2. Ve al directorio del proyecto:
```bash
cd journal-ia
```

### Configuración del Backend (API)

1. Ve al directorio `journalAPI`:
```bash
cd journalAPI
```
2. Instala las dependencias del backend:
```bash
npm install
```

3. Configura las variables de entorno:

Crea un archivo `.env` en el directorio raíz del backend (`journalAPI`) y define las siguientes variables de entorno:
```javascript
MONGODB_URI=mongodb://localhost:27017/nombre-de-la-base-de-datos
API_GPT_KEY=tu-api-key-de-OpenAI
EMAIL=tu-email@tu-dominio
EMAIL_PASSWORD=tu-contraseña-de-email
API_HOSTNAME= tu hostname o ip de api(127.0.0.1)
API_PORT=tu-puerto-api (3001)
```


4. Inicia el servidor del backend:
```bash
npm run start
```

El backend estará disponible en http://localhost:3001.

### Configuración del Frontend (Next.js)

1. Ve al directorio raíz del proyecto:
```bash
cd ..
```


2. Instala las dependencias del frontend:
```bash
npm install
```

3. Configura las variables de entorno:

Crea un archivo `.env.local` en el directorio raíz del frontend y define las siguientes variables de entorno:
```javascript
UNSPLASH_KEY=tu-UNSPLASH_KEY
```

4. Inicia el servidor de desarrollo del frontend:
```bash
npm run dev
```


El frontend estará disponible en http://localhost:3000.

### Uso

A continuación se muestra una guía sobre cómo utilizar y navegar por la aplicación "Journal-IA".

## Registro de usuarios

En la página principal, haz clic en "Iniciar sesión" en la esquina superior derecha.
Si aún no tienes una cuenta, haz clic en "¿Aún no tienes cuenta? Regístrate".
Completa el formulario de registro con tus datos personales y haz clic en "Registrarte".
¡Ahora eres un editor registrado en "Journal-IA" y puedes acceder a todas las funciones disponibles.
## Subir artículos
En la página principal, haz clic en tu nombre de perfil en la esquina superior derecha para acceder a tu perfil.
En la página de tu perfil, selecciona la pestaña "Mis artículos".
Haz clic en el botón "Subir artículo" para comenzar a cargar un nuevo artículo.
Completa el formulario de carga del artículo con la información requerida, como el título, el autor y el contenido.
Una vez que hayas completado el formulario, haz clic en "Enviar" para cargar el artículo.
¡Tu artículo ha sido enviado y estará disponible para su revisión por parte de los revisores y la inteligencia artificial de "Journal-IA".

## Contribución

Contribucion libre, puedes mejorar lo que quieras o nececites.

## Licencia

Aun por definir
 