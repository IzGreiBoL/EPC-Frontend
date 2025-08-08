# 🔧 CONFIGURACIÓN CENTRALIZADA - EPC DEVELOPMENTS

Esta documentación explica la estructura de configuración del proyecto.

### 1. **Environment Files** (Solo configuraciones de entorno)
```
src/environments/environment.ts (base)
src/environments/environment.development.ts
src/environments/environment.production.ts
```
**Contenido**: URLs, SMTP, PDF, servidor

### 2. **App Settings** (Solo configuraciones de negocio)
```
src/app/core/config/app-settings.config.ts
```
**Contenido**: Company info, pricing, models, themes

### 3. **Service Unificado** (Acceso centralizado)
```
src/app/core/services/app-config.service.ts
```
**Propósito**: Combina environment + app-settings

### 4. **Backend (PHP)**
```
mail-backend/config.php
```
**Auto-detección**: Desarrollo vs producción

```typescript
import { AppConfigService } from './core/services/app-config.service';

constructor(private config: AppConfigService) {}

const apiUrl = this.config.getEmailSendUrl();
const companyName = this.config.company.name;
const pricing = this.config.pricing;
const emailConfig = this.config.getFullEmailConfig();
```

### Backend (PHP)
```php
require_once 'config.php';

// Configuraciones disponibles automáticamente
echo COMPANY_NAME;
echo SMTP_HOST;
echo BASE_URL;
// ✅ Nuevo
import { AppConfigService } from '../services/app-config.service';
constructor(private config: AppConfigService) {}
const company = this.config.company.name;

```

## 📝 Notas Importantes

- **Angular environments**: Reemplazados automáticamente durante build
- **Backend sync**: PHP config se sincroniza con frontend configs
```
$config = getConfig();
echo $config['company']['name'];
```

## ⚙️ Configuración de Servidor (Producción)

### Variables de Entorno del Servidor
En el servidor de producción, configurar:
```bash
export SMTP_PASS="tu_password_smtp"
export NODE_ENV="production"
```

### Para Verificar Configuración
Visitar: `https://epcde.com/mail-backend/config.php?debug_config`
(Solo funciona en desarrollo)

## 🛠 Siguientes Pasos

1. **Configurar** password SMTP en servidor de producción
2. **Probar** en ambos entornos

## 📧 Configuración SMTP

### Desarrollo (Mailtrap)
- Host: ``
- Port: ``
- User: ``
- Pass: ``

### Producción (IONOS)
- Host: `smtp.ionos.com`
- Port: `587`
- User: `info@epcde.com`
- Pass: `[Configurar en servidor]`

---
