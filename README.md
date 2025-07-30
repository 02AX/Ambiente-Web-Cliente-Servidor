# Sistema de Denuncias Anónimas

## 📋 Descripción General

Sistema web de denuncias ciudadanas con priorización comunitaria, desarrollado en React.js + Bootstrap. Permite a los usuarios reportar problemas de forma anónima y que la comunidad vote (likes) para priorizar qué denuncias son más importantes. Diseñado como una plataforma autogestión comunitaria estilo Reddit, sin administradores.

## 🏗️ Arquitectura Técnica

### Patrón Arquitectónico
- **MVC (Model-View-Controller)**
  - **Models**: Clases de datos en `src/models/`
  - **Views**: Componentes React en `src/components/` y `src/pages/`
  - **Controllers**: Lógica de negocio en `src/controllers/`

### Stack Tecnológico
- **Frontend**: React.js 18.2.0
- **UI Framework**: Bootstrap 5.3.0 + React-Bootstrap 2.7.0
- **Routing**: React Router DOM 6.8.0
- **Icons**: Bootstrap Icons 1.10.3
- **Build Tool**: React Scripts 5.0.1
- **Language**: JavaScript (ES6+)

## 📁 Estructura de Proyecto

```
proyectoU/
├── public/
│   └── index.html                 # HTML principal
├── src/
│   ├── components/               # Componentes reutilizables
│   │   ├── Navigation.js         # Navbar responsive
│   │   ├── Footer.js             # Footer con links
│   │   ├── DenunciaCard.js       # Card para mostrar denuncias
│   │   └── ComentarioItem.js     # Componente de comentarios
│   ├── pages/                    # Páginas principales
│   │   ├── Inicio.js             # Landing page con hero
│   │   ├── Login.js              # Autenticación demo
│   │   ├── Denuncias.js          # Lista de denuncias (TO CREATE)
│   │   ├── CrearDenuncia.js      # Formulario nueva denuncia (TO CREATE)
│   │   ├── DetalleDenuncia.js    # Vista detalle denuncia (TO CREATE)
│   │   ├── Ranking.js            # Ranking por likes (TO CREATE)
│   │   ├── PerfilUsuario.js      # Perfil del usuario (TO CREATE)
│   │   ├── Comunidad.js          # Reglas y participación (TO CREATE)
│   │   └── Soporte.js            # FAQ y ayuda (TO CREATE)
│   ├── models/                   # Modelos de datos
│   │   ├── Denuncia.js           # Clase Denuncia con métodos
│   │   ├── Usuario.js            # Clase Usuario con métodos
│   │   ├── Comentario.js         # Clase Comentario con métodos
│   │   └── demoData.js           # Datos de demostración
│   ├── controllers/              # Controladores (lógica de negocio)
│   │   ├── AuthController.js     # Singleton para autenticación
│   │   └── DenunciaController.js # Singleton para denuncias
│   ├── utils/                    # Utilidades reutilizables
│   │   ├── dateUtils.js          # Formateo de fechas
│   │   └── generalUtils.js       # Utilidades generales
│   ├── styles/                   # Estilos CSS
│   │   └── App.css               # Estilos globales y paleta
│   ├── App.js                    # Componente principal con routing
│   └── index.js                  # Punto de entrada React
├── package.json                  # Dependencias y scripts
└── README.md                     # Este archivo
```

## 🎨 Sistema de Diseño

### Paleta de Colores (CSS Variables)
```css
:root {
  --primary-blue: #2563eb;      /* Azul principal */
  --secondary-blue: #3b82f6;    /* Azul secundario */
  --white: #ffffff;             /* Blanco */
  --light-gray: #f8fafc;        /* Gris claro backgrounds */
  --medium-gray: #64748b;       /* Gris medio texto */
  --success-green: #10b981;     /* Verde éxito */
  --danger-red: #ef4444;        /* Rojo alertas/likes */
  --warning-yellow: #f59e0b;    /* Amarillo warnings */
  --dark-text: #1e293b;         /* Texto oscuro */
  --light-text: #64748b;        /* Texto claro */
}
```

### Componentes CSS Principales
- `.denuncia-card`: Cards con hover effect y sombras
- `.navbar-custom`: Navbar con colores personalizados
- `.btn-primary-custom`: Botones con transiciones
- `.comentario-item`: Estilo para comentarios
- `.sidebar`: Componentes laterales
- `.fade-in`: Animación de entrada

### Responsive Design
- Mobile-first approach
- Breakpoints Bootstrap estándar
- Navegación colapsable
- Grid responsive con Bootstrap

## 📊 Modelos de Datos

### Clase Denuncia
```javascript
{
  id: string,                    // ID único
  titulo: string,                // Título de la denuncia
  descripcion: string,           // Descripción detallada
  categoria: string,             // Una de las 8 categorías
  fechaCreacion: Date,           // Timestamp de creación
  likes: number,                 // Contador de likes
  comentarios: Array<string>,    // IDs de comentarios
  usuarioId: string,             // ID del usuario creador
  anonimo: boolean,              // Si es anónima (siempre true)
  estado: string                 // 'activa', 'cerrada', 'en_revision'
}
```

### Categorías Disponibles
1. **Seguridad** (color: danger/rojo)
2. **Infraestructura** (color: warning/amarillo)
3. **Medio Ambiente** (color: success/verde)
4. **Servicios Públicos** (color: primary/azul)
5. **Transporte** (color: secondary/gris)
6. **Salud** (color: info/cian)
7. **Educación** (color: success/verde)
8. **Otros** (color: secondary/gris)

### Clase Usuario
```javascript
{
  id: string,                           // ID único
  username: string,                     // Nombre de usuario
  email: string,                        // Email
  fechaRegistro: Date,                  // Fecha de registro
  denunciasCreadas: Array<string>,      // IDs denuncias creadas
  denunciasLikadas: Array<string>,      // IDs denuncias con like
  comentarios: Array<string>,           // IDs comentarios hechos
  configuraciones: {                    // Configuraciones usuario
    notificaciones: boolean,
    mostrarPerfil: boolean,
    modoAnonimo: boolean
  }
}
```

### Clase Comentario
```javascript
{
  id: string,                    // ID único
  denunciaId: string,            // ID de la denuncia padre
  usuarioId: string,             // ID del usuario
  contenido: string,             // Texto del comentario
  fechaCreacion: Date,           // Timestamp
  likes: number,                 // Likes del comentario
  respuestas: Array<string>,     // IDs de respuestas
  comentarioPadreId: string,     // ID del comentario padre (si es respuesta)
  anonimo: boolean,              // Si es anónimo
  estado: string                 // 'activo', 'inactivo', 'reportado'
}
```

## 🔧 Controladores (Singleton Pattern)

### AuthController
**Responsabilidades:**
- Manejo de autenticación demo (admin/password)
- Persistencia en localStorage
- Gestión de sesión de usuario
- Listeners de cambios de autenticación
- Validación de permisos

**Métodos Principales:**
- `login(username, password)`: Autenticación
- `logout()`: Cerrar sesión
- `getCurrentUser()`: Usuario actual
- `isUserAuthenticated()`: Estado de auth
- `restoreSession()`: Restaurar desde localStorage
- `addAuthListener(listener)`: Agregar listener

### DenunciaController
**Responsabilidades:**
- CRUD de denuncias
- Sistema de likes
- Gestión de comentarios
- Filtros y búsquedas
- Estadísticas

**Métodos Principales:**
- `getAllDenuncias()`: Todas las denuncias
- `crearDenuncia(datosForm)`: Crear nueva
- `toggleLikeDenuncia(id)`: Like/unlike
- `agregarComentario(denunciaId, contenido)`: Nuevo comentario
- `getDenunciasOrdenadas(criterio)`: Ordenamiento
- `buscarDenuncias(termino)`: Búsqueda

## 🛣️ Sistema de Rutas

```javascript
/                          → Inicio.js (landing page)
/denuncias                 → Denuncias.js (lista con filtros)
/denuncias/crear           → CrearDenuncia.js (requiere auth)
/denuncias/:id             → DetalleDenuncia.js (detalle + comentarios)
/ranking                   → Ranking.js (ordenado por likes)
/perfil                    → PerfilUsuario.js (requiere auth)
/comunidad                 → Comunidad.js (reglas participación)
/soporte                   → Soporte.js (FAQ + ayuda)
/login                     → Login.js (autenticación demo)
```

## 🔐 Sistema de Autenticación

### Estado Actual (Demo)
- **Usuario Demo**: admin / password
- **Persistencia**: localStorage
- **Session Restore**: Automática al cargar app
- **Protected Routes**: Crear denuncia, perfil

### Preparado para Firebase
- AuthController abstraído para fácil migración
- Estructura de usuario compatible
- Listeners para cambios de estado
- Manejo de errores implementado

## 📱 Componentes Principales

### Navigation.js
- Navbar responsive Bootstrap
- Links a todas las secciones
- Dropdown de usuario autenticado
- Botón "Nueva Denuncia" destacado
- Responsive collapse en móviles

### DenunciaCard.js
- Card reutilizable para denuncias
- Sistema de likes integrado
- Truncado de texto automático
- Badges de categorías coloreados
- Link a detalle
- Contador de comentarios

### ComentarioItem.js
- Diseño tipo chat/foro
- Avatar generado por iniciales
- Timestamps relativos ("Hace 2 horas")
- Badge de usuario anónimo
- Likes en comentarios

## 🎯 Funcionalidades Implementadas

### ✅ Completadas
1. **Arquitectura MVC** completa
2. **Sistema de autenticación** demo
3. **Modelos de datos** con validaciones
4. **Página de inicio** con hero y secciones
5. **Sistema de likes** funcional
6. **Navegación responsive**
7. **Paleta de colores** consistente
8. **Datos demo** realistas
9. **Utilidades** de fecha y generales
10. **Footer** informativo

### 🚧 Pendientes por Implementar
1. **Denuncias.js** - Lista con filtros por categoría
2. **CrearDenuncia.js** - Formulario de nueva denuncia
3. **DetalleDenuncia.js** - Vista completa + comentarios
4. **Ranking.js** - Lista ordenada por likes
5. **PerfilUsuario.js** - Estadísticas y configuraciones
6. **Comunidad.js** - Reglas y participación
7. **Soporte.js** - FAQ y ayuda

## 🔨 Comandos de Desarrollo

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start

# Construir para producción
npm run build

# Ejecutar tests
npm test

# Eject configuración (NO RECOMENDADO)
npm run eject
```

## 📋 Datos Demo Incluidos

### Denuncias (8 ejemplos)
- Semáforo dañado (47 likes)
- Falta iluminación parque (32 likes)
- Contaminación auditiva (28 likes)
- Falta recolección basura (19 likes)
- Hueco peligroso (15 likes)
- Problema suministro agua (12 likes)
- Vandalismo parada autobús (8 likes)
- Falta señalización escolar (6 likes)

### Usuarios (3 ejemplos)
- admin (usuario demo principal)
- ciudadano_activo
- vecino_preocupado

### Comentarios (11 ejemplos)
- Distribuidos entre las denuncias
- Conversaciones realistas
- Diferentes timestamps

### Noticias (3 ejemplos)
- Sistema de votación implementado
- Reunión comunitaria
- Respuesta municipalidad

## 🎨 Guía de Estilo

### Convenciones de Código
- **Componentes**: PascalCase (ej: `DenunciaCard.js`)
- **Archivos JS**: camelCase (ej: `authController.js`)
- **Funciones**: camelCase descriptivo
- **Constantes**: UPPER_SNAKE_CASE
- **CSS Classes**: kebab-case

### Estructura de Componentes
```javascript
import React, { useState, useEffect } from 'react';
import { Bootstrap Components } from 'react-bootstrap';
import { Router components } from 'react-router-dom';
import CustomComponents from '../path';
import Controllers from '../controllers';
import Utils from '../utils';

const ComponentName = ({ props }) => {
  // Estados
  const [state, setState] = useState();
  
  // Effects
  useEffect(() => {}, []);
  
  // Handlers
  const handleAction = () => {};
  
  // Render
  return (
    <div className="component-class fade-in">
      {/* JSX */}
    </div>
  );
};

export default ComponentName;
```

## 🚀 Próximos Pasos de Desarrollo

### Prioridad Alta
1. **Página Denuncias**: Lista completa con filtros
2. **Crear Denuncia**: Formulario con validación
3. **Detalle Denuncia**: Vista completa + comentarios

### Prioridad Media
4. **Ranking**: Lista ordenada por popularidad
5. **Perfil Usuario**: Dashboard personal
6. **Búsqueda**: Sistema de búsqueda global

### Prioridad Baja
7. **Comunidad**: Reglas y participación
8. **Soporte**: FAQ dinámico
9. **Configuraciones**: Personalización usuario

## 🔧 Consideraciones Técnicas

### Performance
- Componentes memo para evitar re-renders
- Lazy loading para rutas
- Debounce en búsquedas
- Virtual scrolling para listas largas

### Accesibilidad
- Semantic HTML
- ARIA labels
- Keyboard navigation
- Screen reader support
- Color contrast compliance

### SEO (Futuro)
- React Helmet para meta tags
- Server-side rendering
- Sitemap dinámico
- Schema.org markup

### Testing (Futuro)
- Jest + React Testing Library
- Unit tests para controllers
- Integration tests para páginas
- E2E con Cypress

## 🔗 Migración a Firebase

### AuthController
```javascript
// Actual: Demo auth
const result = authController.login(username, password);

// Futuro: Firebase auth
import { signInWithEmailAndPassword } from 'firebase/auth';
const result = await signInWithEmailAndPassword(auth, email, password);
```

### DenunciaController
```javascript
// Actual: Array en memoria
this.denuncias = [...denunciasDemo];

// Futuro: Firestore
import { collection, getDocs } from 'firebase/firestore';
const snapshot = await getDocs(collection(db, 'denuncias'));
```

### Estructura Firestore Propuesta
```
denuncias/          # Colección principal
  - {id}/           # Documento de denuncia
    - comentarios/  # Subcolección de comentarios

usuarios/           # Colección de usuarios
  - {uid}/          # Documento de usuario

configuracion/      # Configuración global
  - categorias/     # Categorías disponibles
  - estadisticas/   # Stats globales
```

## 📞 Contacto y Soporte

Este proyecto está preparado para ser continuado por otros desarrolladores o modelos de AI. La arquitectura modular y documentación detallada facilitan la extensión y mantenimiento.

### Información de Estado
- **Versión**: 1.0.0
- **Estado**: Demo funcional
- **Última actualización**: 2024
- **Compatibilidad**: React 18+, Node 16+

---

**Nota**: Este README contiene el máximo nivel de detalle técnico para facilitar la continuación del desarrollo por parte de otros modelos de AI o desarrolladores. 