# 🚀 Configuración de Variables de Entorno para Vercel

## Variables Requeridas para Deployment

Configura estas variables en tu dashboard de Vercel:

### **Variables Básicas (REQUERIDAS)**
```
NEXT_PUBLIC_DOMAIN=https://tu-dominio-vercel.vercel.app
NEXT_PUBLIC_PHONE_NUMBER=+1-800-123-4567
NEXT_PUBLIC_COMPANY_NAME=LawProactive
NEXT_PUBLIC_COMPANY_ADDRESS=123 Legal St, Los Angeles, CA 90210
```

### **Analytics (OPCIONALES - pero recomendadas)**
```
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-XXXXXXXXXX
NEXT_PUBLIC_FACEBOOK_PIXEL_ID=XXXXXXXXXX
```

### **Strapi (COMENTADAS - no configurar por ahora)**
```
# NO CONFIGURAR ESTAS VARIABLES EN VERCEL POR AHORA
# STRAPI_API_URL=
# STRAPI_API_TOKEN=
```

## 📋 Pasos para Configurar en Vercel

1. **Ve a tu proyecto en Vercel Dashboard**
2. **Click en "Settings"**
3. **Click en "Environment Variables"**
4. **Agrega cada variable una por una:**
   - Name: `NEXT_PUBLIC_DOMAIN`
   - Value: `https://tu-proyecto.vercel.app`
   - Environment: `Production`, `Preview`, `Development`

5. **Repite para todas las variables requeridas**

## ⚠️ Importante

- **NO configures** las variables de Strapi hasta que resolvamos el problema
- **SÍ configura** las variables NEXT_PUBLIC_* para que el sitio funcione
- El sitio funcionará perfectamente sin Strapi

## 🔄 Después de Configurar

1. **Redeploy** tu proyecto en Vercel
2. **Verifica** que el sitio carga correctamente
3. **Prueba** algunas páginas de ciudades como `/los-angeles`
