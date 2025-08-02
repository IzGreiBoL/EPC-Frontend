# 🔧 Guía de Configuración Completa - EPC Frontend

## 🎯 RESUMEN EJECUTIVO

Esta guía explica cómo configurar fácilmente todos los aspectos de tu aplicación EPC sin tocar el código fuente.

## 📁 Archivos de Configuración Principales

### 🎯 **Configuración Principal Frontend**
**Archivo**: `src/app/core/config/app-settings.config.ts`

Este es el archivo más importante - contiene **TODA** la configuración de la aplicación frontend:

#### 🏢 **Información de la Empresa**
```typescript
company: {
  name: 'EPC DEVELOPMENTS',           // Nombre de tu empresa
  tagline: 'CUSTOM BUILDER',          // Eslogan
  phone: {
    display: '652-341-333',           // Teléfono en página principal
    business: '+832-931-0425'         // Teléfono en documentos
  },
  email: 'EPCDEVELOPMENTS@GMAIL.COM', // Email de contacto
  website: {
    display: 'EPCBI.COM',             // Texto mostrado
    url: 'https://epcbi.com'          // URL real
  },
  location: 'San Antonio, Texas',     // Ubicación
  serviceArea: 'San Antonio to Austin area', // Área de servicio
  
  aboutUs: {
    welcome: 'Welcome to EPC Developments, a premier custom home construction company...',
    commitment: 'At EPC Developments, we understand that your home is more than just a building...',
    closing: 'Thank you for considering EPC Developments for your custom home construction needs...'
  },
  
  // Enlaces de Redes Sociales (con íconos en footer)
  socialMedia: {
    instagram: {
      url: 'https://www.instagram.com/tu_empresa/',
      show: true  // true = mostrar, false = ocultar
    },
    linkedin: {
      url: 'https://www.linkedin.com/company/tu-empresa/',
      show: true  // true = mostrar, false = ocultar
    }
  }
}
```

#### 💰 **Configuración de Precios Completa**
```typescript
pricing: {
  // ✅ Precios base por modelo de casa
  basePrices: {
    avalon: 180,      // $/sqft modelo Avalon
    cascade: 200,     // $/sqft modelo Cascade  
    estates: 220,     // $/sqft modelo Estates
    pandora: 195,     // $/sqft modelo Pandora
    jewel: 210,       // $/sqft modelo Jewel
    custom: 250,      // $/sqft diseño personalizado
    remodel: 120      // $/sqft remodelación
  },
  
  // ✅ Incrementos por características adicionales
  priceIncrements: {
    bathrooms: 15000,  // Precio por baño extra
    bedrooms: 12000,   // Precio por habitación extra
    garage: 8000       // Precio por garaje
  },
  
  // ✅ Configuración original (mantenida para compatibilidad)
  basePerSqft: {
    basic: 190,        // Precio base cotización básica ($/sqft)
    advanced: 101.42,  // Precio base cotización avanzada ($/sqft)
    remodel: 0,        // Precio base remodelación ($/sqft)
    custom: 190        // Precio base personalizada ($/sqft)
  },
  customPricing: {
    bedroomPricePerExtra: 7500,  // Precio por habitación extra
    bathroomPricePerExtra: 6000, // Precio por baño extra
    defaultBedrooms: 3,          // Habitaciones por defecto
    defaultBathrooms: 2          // Baños por defecto
  }
}
```

#### 🏠 **Modelos de Casas Configurables**
```typescript
houseModels: [
  {
    id: 1,
    name: 'Avalon',
    image: 'images/avalon/image1.jpg',
    description: 'Modern family home with spacious layout',
    sqft: { min: 1800, max: 2400 },
    bedrooms: { min: 3, max: 4 },
    bathrooms: { min: 2, max: 3 },
    folder: 'avalon',
    imagesCount: 5
  }
  // ... más modelos configurables
]
```

#### 🛠️ **Servicios Ofrecidos**
```typescript
services: [
  {
    slug: 'custom-home-design',
    title: 'Custom Home Design',
    image: 'images/services/services-custom-home-design.jpg',
    text: 'Descripción personalizable del servicio...',
    category: 'custom-home-design',
    showInHeader: true,  // ✅ Controla si aparece en menú
    redirectUrl: '/quotes/custom'  // ✅ URL personalizable
  }
  // ... más servicios
]
```

#### 📋 **Categorías de Cotización**
```typescript
// ✅ Categorías básicas
basicCategories: [
  { name: 'Exterior', subcategories: ['Siding', 'Roofing', 'Windows'] },
  { name: 'Interior', subcategories: ['Flooring', 'Paint', 'Fixtures'] }
  // ... más categorías
],

// ✅ Categorías avanzadas  
advancedCategories: [
  { name: 'Kitchen', subcategories: ['Cabinets', 'Countertops', 'Appliances'] },
  { name: 'Bathrooms', subcategories: ['Tiles', 'Fixtures', 'Vanities'] }
  // ... más categorías
]
```

#### 🎨 **Colores del Tema**
```typescript
theme: {
  colors: {
    primary: '#C49538',        // Color dorado principal
    primaryDark: '#B7832C',    // Color dorado oscuro
    dark1: '#1C1C1F',         // Fondo oscuro principal
    dark2: '#161619',         // Fondo oscuro secundario
    textLight: '#ECECEC'      // Texto claro
  }
}
```

### 🌐 **Configuración del Backend**
**Archivo**: `mail-backend/config.js`

```javascript
const BACKEND_CONFIG = {
  company: {
    name: 'EPC DEVELOPMENTS',
    tagline: 'CUSTOM BUILDER', 
    email: 'EPCDEVELOPMENTS@GMAIL.COM',
    website: 'www.epcbi.com'
  },
  
  // Configuración de email
  email: {
    // Para desarrollo - usar Mailtrap
    development: {
      sender: '"EPC Developments" <hello@demomailtrap.co>',
      recipientEmail: 'hello@demomailtrap.co'
    },
    
    // Para producción - cambiar estos valores
    production: {
      sender: '"EPC Developments" <noreply@epcbi.com>',
      recipientEmail: 'EPCDEVELOPMENTS@GMAIL.COM'
    }
  }
};
```

### 🌍 **Variables de Entorno**
**Archivos**: 
- `src/environments/environment.development.ts` (desarrollo)
- `src/environments/environment.production.ts` (producción)

```typescript
// environment.production.ts
export const environment = {
  production: true,
  api: {
    baseUrl: 'https://api.tuempresa.com',  // ✅ URL de producción
    endpoints: {
      sendEmail: '/send-email',
      quotePdf: '/quote-template-pdf.html'
    }
  },
  email: {
    sender: '"Tu Empresa" <noreply@tuempresa.com>',  // ✅ Email de producción
    recipientEmail: 'contacto@tuempresa.com'
  }
};
```

## 📝 **INSTRUCCIONES PASO A PASO**

### 🔄 **1. Cambiar Información de la Empresa**
1. Abrir `src/app/core/config/app-settings.config.ts`
2. Modificar la sección `company`:
```typescript
company: {
  name: 'SU EMPRESA',
  tagline: 'Su eslogan aquí',
  phone: {
    display: '+1 (XXX) XXX-XXXX',
    business: '+1XXXXXXXXXX'
  },
  email: 'contacto@suempresa.com',
  website: {
    display: 'SUEMPRESA.COM',
    url: 'https://suempresa.com'
  },
  location: 'Su Ciudad, Estado',
  serviceArea: 'Su área de servicio',
  aboutUs: {
    welcome: 'Su texto de bienvenida personalizado...',
    commitment: 'Su mensaje de compromiso...',
    closing: 'Su mensaje de cierre...'
  },
  
  //
  socialMedia: {
    instagram: {
      url: 'https://www.instagram.com/su_empresa/',
      show: true  // Mostrar ícono en footer
    },
    linkedin: {
      url: 'https://www.linkedin.com/company/su-empresa/',
      show: true  // Mostrar ícono en footer
    }
  }
}
```

### 🔄 **2. Configurar Redes Sociales**
Para agregar o modificar los enlaces de redes sociales en el footer:
```typescript
// En app-settings.config.ts
socialMedia: {
  instagram: {
    url: 'https://www.instagram.com/SU_CUENTA_INSTAGRAM/',
    show: true  // Cambiar a false para ocultar
  },
  linkedin: {
    url: 'https://www.linkedin.com/company/SU-EMPRESA-LINKEDIN/',
    show: true  // Cambiar a false para ocultar
  }
}
```
**Características:**
- ✅ Íconos profesionales SVG integrados
- ✅ Efectos hover con color primario del tema
- ✅ Enlaces se abren en nueva pestaña
- ✅ Completamente configurables (mostrar/ocultar)
- ✅ Responsive en todos los dispositivos

### 🔄 **3. Actualizar Precios**
```typescript
pricing: {
  basePrices: {
    avalon: SU_PRECIO_AVALON,      // Ejemplo: 200
    cascade: SU_PRECIO_CASCADE,    // Ejemplo: 220
    estates: SU_PRECIO_ESTATES,    // Ejemplo: 240
    // ... resto de modelos
  },
  priceIncrements: {
    bathrooms: SU_PRECIO_BAÑO_EXTRA,     // Ejemplo: 18000
    bedrooms: SU_PRECIO_HABITACION_EXTRA, // Ejemplo: 15000
    garage: SU_PRECIO_GARAJE              // Ejemplo: 10000
  }
}
```

### 🔄 **3. Configurar Emails de Producción**
1. **Frontend**: Modificar `src/environments/environment.production.ts`
2. **Backend**: Modificar `mail-backend/config.js`

### 🔄 **4. Personalizar Servicios**
1. Editar la sección `services` en `app-settings.config.ts`
2. Servicios con `showInHeader: true` aparecen en el menú principal
3. Configurar `redirectUrl` para redirecciones específicas

### 🔄 **5. Modificar Modelos de Casas**
1. Editar la sección `houseModels` en `app-settings.config.ts`
2. Configurar imágenes, descripciones, rangos de sqft, habitaciones, etc.
3. Actualizar `imagesCount` según las imágenes disponibles

## 🎨 **Personalización Visual**

### **Cambiar Colores del Tema**
```typescript
// En app-settings.config.ts
theme: {
  colors: {
    primary: '#TU_COLOR_PRINCIPAL',      // Ejemplo: '#FF6B35' (naranja)
    primaryDark: '#TU_COLOR_OSCURO',     // Ejemplo: '#E85A2B' 
    dark1: '#TU_FONDO_OSCURO_1',        // Ejemplo: '#2C2C2F'
    dark2: '#TU_FONDO_OSCURO_2',        // Ejemplo: '#262629'
    textLight: '#TU_COLOR_TEXTO'        // Ejemplo: '#F0F0F0'
  }
}
```

### **Cambiar Logos e Imágenes**
```typescript
// En app-settings.config.ts (si existe sección de imágenes)
images: {
  logo: '/images/tu-logo.png',
  thankYou: '/images/tu-imagen-gracias.png',
  // Agregar más imágenes según necesidad
}
```

## 📄 **Configuraciones Legales y Adicionales**
```typescript
// En app-settings.config.ts
legal: {
  quoteValidityDays: 30,  // Días de validez de cotización
  quoteDisclaimer: 'TU TEXTO LEGAL PERSONALIZADO...',
  // Agregar más textos legales según necesidad
}
```

## 🔧 **COMANDOS ÚTILES**

```bash
# Desarrollo - Frontend
npm start

# Desarrollo - Backend  
cd mail-backend
npm start
# o
node index.js

# Producción - Build
npm run build

# Producción - Servir
npm run serve:ssr:EPC-Frontend

# Verificar configuración
npm run build --if-present
```

## ⚠️ **NOTAS IMPORTANTES**

### 📋 **Después de Hacer Cambios**
1. **Frontend**: Reiniciar el servidor de desarrollo (`Ctrl+C` y luego `npm start`)
2. **Backend**: Reiniciar el servidor de correos
3. **Producción**: Recompilar la aplicación (`npm run build`)

### 🔒 **Seguridad y Respaldos**
1. **Mantén backups** de tus archivos de configuración originales
2. **Prueba en desarrollo** antes de aplicar en producción  
3. **Verifica sintaxis** de los archivos JSON/TypeScript antes de guardar

### 📂 **Rutas de Archivos**
- **Imágenes**: Relativas a la carpeta `public/images/`
- **Configuraciones**: Usar rutas absolutas desde `src/`
- **URLs de API**: Incluir protocolo completo (`https://`)

### � **Configuración de Emails**
- **Desarrollo**: Se recomienda usar Mailtrap para pruebas
- **Producción**: Configurar SMTP real (Gmail, SendGrid, etc.)
- **Templates**: Los placeholders `{{VARIABLE}}` se reemplazan automáticamente

## 🎉 **BENEFICIOS DE ESTA REFACTORIZACIÓN**

✅ **Todo configurable**: Eliminados TODOS los valores hardcodeados  
✅ **Fácil mantenimiento**: Un solo lugar para cada tipo de configuración  
✅ **Escalable**: Fácil agregar nuevas configuraciones sin tocar código  
✅ **Tipo-seguro**: TypeScript previene errores de configuración  
✅ **Documentado**: Cada configuración está claramente explicada  
✅ **Modular**: Servicios independientes y reutilizables  
✅ **Profesional**: Sistema de configuración enterprise-grade

## 📞 **Soporte y Resolución de Problemas**

### 🐛 **Problemas Comunes**
1. **Error de compilación**: Verificar sintaxis en archivos TypeScript
2. **Emails no se envían**: Revisar configuración SMTP en backend
3. **Imágenes no cargan**: Verificar rutas relativas en `public/images/`
4. **Precios incorrectos**: Confirmar valores numéricos en configuración

### 🔍 **Verificación de Configuración**
```bash
# Verificar que la aplicación compila
npm run build --if-present

# Verificar sintaxis TypeScript
npx tsc --noEmit

# Verificar el backend
cd mail-backend && node -c index.js
```

---

**✅ RESUMEN**: Con esta guía completa, puedes personalizar **TODO** el sistema - desde información de empresa y precios hasta colores y textos - sin necesidad de tocar el código fuente. Todos los valores hardcodeados han sido eliminados y centralizados para tu facilidad.

*📧 Para soporte técnico adicional con estas configuraciones, contactar al desarrollador.*
