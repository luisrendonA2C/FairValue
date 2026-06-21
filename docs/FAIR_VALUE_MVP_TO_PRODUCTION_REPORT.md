# FAIR VALUE — Reporte Técnico: MVP a Producción

**Versión:** 1.0  
**Fecha:** Junio 2025  
**Preparado para:** Stakeholders Fair Value  
**Clasificación:** Confidencial — Planificación Técnica  

---

## Tabla de Contenidos

1. [Resumen Ejecutivo](#1-resumen-ejecutivo)
2. [Estado Actual del MVP](#2-estado-actual-del-mvp)
3. [Análisis de Brechas (Gap Analysis)](#3-análisis-de-brechas-gap-analysis)
4. [Arquitectura de Producción Propuesta](#4-arquitectura-de-producción-propuesta)
5. [Diseño de Base de Datos](#5-diseño-de-base-de-datos)
6. [Autenticación y Autorización](#6-autenticación-y-autorización)
7. [API y Capa de Servicios](#7-api-y-capa-de-servicios)
8. [Sistema de Eventos en Tiempo Real](#8-sistema-de-eventos-en-tiempo-real)
9. [Sistema de Lead Scoring](#9-sistema-de-lead-scoring)
10. [Modelo de Privacidad y Revelación de Datos](#10-modelo-de-privacidad-y-revelación-de-datos)
11. [Gestión de Imágenes y Archivos](#11-gestión-de-imágenes-y-archivos)
12. [Sistema de Chat y Mensajería](#12-sistema-de-chat-y-mensajería)
13. [Verificación de Identidad (KYC)](#13-verificación-de-identidad-kyc)
14. [Notificaciones](#14-notificaciones)
15. [Pagos y Monetización](#15-pagos-y-monetización)
16. [Testing y QA](#16-testing-y-qa)
17. [Seguridad](#17-seguridad)
18. [DevOps y CI/CD](#18-devops-y-cicd)
19. [Roadmap de Implementación](#19-roadmap-de-implementación)
20. [Estimaciones de Tiempo y Costo](#20-estimaciones-de-tiempo-y-costo)
21. [Riesgos Técnicos](#21-riesgos-técnicos)
22. [Métricas y Monitoreo](#22-métricas-y-monitoreo)
23. [Consideraciones Legales y Compliance (Costa Rica)](#23-consideraciones-legales-y-compliance-costa-rica)
24. [Escalabilidad y Crecimiento](#24-escalabilidad-y-crecimiento)
25. [Recomendaciones Finales y Próximos Pasos](#25-recomendaciones-finales-y-próximos-pasos)

---

## 1. Resumen Ejecutivo

### Contexto

Fair Value es una plataforma premium de intermediación vehicular para el mercado costarricense. Conecta compradores calificados con concesionarios verificados ("patios") a través de un modelo de eventos temporales con ofertas a ciegas, generando leads cualificados para los dealers.

### Estado Actual

El proyecto cuenta con un **MVP frontend completamente funcional** construido con Next.js 16, React 19 y TypeScript 5. El prototipo incluye:

- ✅ 30+ páginas navegables con 3 perspectivas (Comprador, Dealer, Admin)
- ✅ Sistema de diseño premium implementado (tokens de color, tipografía, componentes)
- ✅ Lógica de negocio simulada (lead scoring, ciclos de vida, privacidad)
- ✅ Datos mock realistas (13 usuarios, 12 vehículos, 4 dealers, 3 eventos)
- ✅ Responsive design (mobile, tablet, desktop)

### Objetivo de Este Documento

Definir el camino técnico completo desde el estado actual de prototipo frontend hasta una plataforma de producción lista para usuarios reales en Costa Rica, incluyendo arquitectura, estimaciones, riesgos y roadmap.

### Propuesta de Valor Técnica

El frontend existente representa aproximadamente un **30% del trabajo total** de la plataforma completa. Este documento cubre el 70% restante: backend, base de datos, autenticación, integraciones, infraestructura y operaciones.

---

## 2. Estado Actual del MVP

### 2.1 Stack Tecnológico Actual

| Componente | Tecnología | Versión |
|---|---|---|
| Framework | Next.js (App Router) | 16.2.9 |
| UI Library | React | 19.2.4 |
| Lenguaje | TypeScript | ^5 |
| Estilos | Tailwind CSS | ^4 |
| Iconos | lucide-react | ^1.21.0 |
| Backend | ❌ No existe | — |
| Base de Datos | ❌ No existe | — |
| Autenticación | ❌ Simulada (localStorage) | — |

### 2.2 Estructura de Rutas Implementadas

| Grupo | Rutas | Descripción |
|---|---|---|
| Público | `/`, `/inventory`, `/vehicle/[id]`, `/events`, `/how-it-works`, `/locations`, `/services`, `/help-center`, `/for-dealers` | Landing, catálogo, info |
| Auth | `/login`, `/register` | Login/registro simulado |
| Comprador | `/buyer/dashboard`, `/buyer/profile`, `/buyer/verification`, `/buyer/watchlist`, `/buyer/offers`, `/buyer/chat` | Panel completo del comprador |
| Dealer | `/dealer/dashboard`, `/dealer/vehicles`, `/dealer/documents`, `/dealer/leads`, `/dealer/chat` | Panel completo del dealer |
| Admin | `/admin/dashboard`, `/admin/users`, `/admin/dealers`, `/admin/vehicles`, `/admin/events`, `/admin/offers`, `/admin/leads`, `/admin/content`, `/admin/settings`, `/admin/settings/audit` | Panel administrativo completo |

### 2.3 Entidades de Datos (TypeScript Interfaces)

| Entidad | Campos Clave | Volumen Mock |
|---|---|---|
| User | id, name, email, phone, role, verificationStatus, budgetRange, vehiclePreferences, profileCompleteness | 13 registros |
| Vehicle | id, dealerId, make, model, year, mileage, fuelType, transmission, price, status, vin | 12 registros |
| Dealer | id, userId, businessName, contactEmail, approvalStatus, vehicleCount, leadCount | 4 registros |
| Event | id, name, description, startDate, endDate, status, vehicleIds, offerCount | 3 registros |
| Offer | id, buyerId, vehicleId, eventId, amount, submissionDate, status | 20 registros |
| Lead | id, buyerId, vehicleId, dealerId, score, level, reasons, status, releaseStatus, isUnlocked | 10 registros |
| Message | id, threadId, senderId, senderName, text, timestamp | 11 registros |
| ScoringWeights | offerAmount, verification, profileCompleteness, timing | Configuración |

### 2.4 Lógica de Negocio Implementada (Mock)

**Lead Scoring:**
- Algoritmo `calculateLeadScore` con pesos configurables
- Pesos default: Oferta 40%, Verificación 25%, Perfil 20%, Timing 15%
- Validación de que pesos sumen exactamente 100
- Niveles: Priority (80-100), Hot (60-79), Warm (40-59), Cold (0-39)

**Ciclos de Vida:**
- Evento: `scheduled` → `active` → `closed` → `in_review` → `finished`
- Vehículo: `draft` → `pending_approval` → `active` → `assigned_to_event` → `closed`
- Oferta: `pending` → `accepted` | `rejected` | `withdrawn`
- Lead: `new` → `contacted` → `converted` | `lost`

**Modelo de Privacidad:**
- Comprador anónimo durante eventos activos
- Dealer oculto durante eventos activos
- Datos se revelan solo tras selección de lead

### 2.5 Lo Que NO Existe (y Se Requiere para Producción)

- ❌ Backend/API real
- ❌ Base de datos persistente
- ❌ Autenticación real (OAuth, JWT, sesiones)
- ❌ Almacenamiento de archivos/imágenes
- ❌ WebSockets/tiempo real
- ❌ Sistema de pagos
- ❌ Envío de emails/notificaciones
- ❌ KYC/verificación de identidad real
- ❌ Logging, monitoreo, alertas
- ❌ CI/CD pipeline
- ❌ Tests automatizados
- ❌ Documentación de API

---

## 3. Análisis de Brechas (Gap Analysis)

### 3.1 Matriz de Brechas por Categoría

| Categoría | Estado MVP | Estado Producción Requerido | Prioridad | Esfuerzo |
|---|---|---|---|---|
| **Backend/API** | No existe | API REST/GraphQL completa | 🔴 Crítica | Alto |
| **Base de Datos** | Mock in-memory | PostgreSQL con relaciones, índices, migraciones | 🔴 Crítica | Alto |
| **Autenticación** | localStorage fake | OAuth2 + JWT + MFA + roles | 🔴 Crítica | Medio |
| **Autorización** | Sin control real | RBAC por ruta, recurso y acción | 🔴 Crítica | Medio |
| **Almacenamiento** | URLs de Unsplash | Object storage (fotos vehículos, documentos KYC) | 🟡 Alta | Medio |
| **Tiempo Real** | No existe | WebSockets para chat, eventos live, notificaciones | 🟡 Alta | Medio |
| **Pagos** | No existe | Pasarela de pagos (comisiones, suscripciones) | 🟡 Alta | Medio |
| **Email/SMS** | No existe | Transaccional + marketing básico | 🟡 Alta | Bajo |
| **KYC** | UI mock | Verificación real de documentos | 🟠 Media | Alto |
| **Búsqueda** | Filtros cliente | Full-text search con facets | 🟠 Media | Medio |
| **Analytics** | No existe | Tracking de comportamiento + dashboards | 🟠 Media | Bajo |
| **Testing** | No existe | Unit + Integration + E2E | 🟠 Media | Medio |
| **CI/CD** | No existe | Pipeline automatizado | 🟠 Media | Bajo |
| **Monitoreo** | No existe | APM, logs, alertas, uptime | 🟢 Normal | Bajo |
| **CDN/Performance** | No optimizado | CDN, caching, image optimization | 🟢 Normal | Bajo |
| **Documentación** | Básica | API docs, runbooks, onboarding | 🟢 Normal | Bajo |

### 3.2 Dependencias Críticas Entre Brechas

```
Base de Datos ──→ Backend/API ──→ Autenticación ──→ Todo lo demás
                       │
                       ├──→ Almacenamiento (imágenes requieren API)
                       ├──→ Pagos (requiere usuarios reales)
                       ├──→ Tiempo Real (requiere sesiones reales)
                       └──→ KYC (requiere storage + API)
```

### 3.3 Impacto en Frontend Existente

| Área Frontend | Cambios Requeridos | Complejidad |
|---|---|---|
| Data fetching | Reemplazar imports directos por API calls (fetch/SWR/React Query) | Media |
| Autenticación | Integrar provider real, proteger rutas, manejar tokens | Media |
| Formularios | Conectar a API real, manejar errores del servidor | Baja |
| Estado global | Migrar de localStorage a estado server-side + cache | Media |
| Imágenes | Cambiar URLs de Unsplash a storage real | Baja |
| Chat | Integrar WebSocket real | Alta |
| Notificaciones | Integrar push notifications | Media |

**Estimación:** Los cambios en frontend para integrar el backend representan ~2-3 semanas de trabajo adicional.

---

## 4. Arquitectura de Producción Propuesta

### 4.1 Opción PRIMARIA: Supabase + Next.js API Routes (Recomendada)

**Justificación:** Tiempo-al-mercado más rápido. Supabase provee autenticación, base de datos PostgreSQL, storage, realtime y edge functions en un solo servicio administrado. Ideal para startup en fase inicial.

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTE (Browser)                      │
│         Next.js App (SSR + CSR) — Vercel Edge Network        │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    NEXT.JS SERVER                             │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ API Routes   │  │ Server       │  │ Middleware        │  │
│  │ /api/*       │  │ Actions      │  │ (Auth + RBAC)     │  │
│  └──────┬───────┘  └──────┬───────┘  └──────────────────┘  │
│         │                  │                                  │
└─────────┼──────────────────┼────────────────────────────────┘
          │                  │
          ▼                  ▼
┌─────────────────────────────────────────────────────────────┐
│                      SUPABASE CLOUD                           │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌────────┐  ┌─────────────┐  │
│  │PostgreSQL│  │   Auth   │  │Storage │  │  Realtime    │  │
│  │  (DB)    │  │(GoTrue)  │  │(S3-like)│  │(WebSockets) │  │
│  └──────────┘  └──────────┘  └────────┘  └─────────────┘  │
│                                                              │
│  ┌──────────────┐  ┌──────────────────────────────────────┐ │
│  │Edge Functions│  │  Row Level Security (RLS Policies)    │ │
│  └──────────────┘  └──────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────┐
│                   SERVICIOS EXTERNOS                          │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌────────┐  ┌─────────────┐  │
│  │ Resend   │  │  Stripe  │  │Twilio  │  │ Veriff/     │  │
│  │ (Email)  │  │(Payments)│  │ (SMS)  │  │ Onfido(KYC) │  │
│  └──────────┘  └──────────┘  └────────┘  └─────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**Componentes Clave:**

| Capa | Tecnología | Función |
|---|---|---|
| Frontend Hosting | Vercel | SSR, Edge Functions, CDN global |
| Backend Logic | Next.js API Routes + Server Actions | Lógica de negocio, validación |
| Base de Datos | Supabase PostgreSQL | Datos relacionales, RLS |
| Autenticación | Supabase Auth (GoTrue) | OAuth, email/password, MFA |
| Storage | Supabase Storage | Imágenes vehículos, documentos KYC |
| Realtime | Supabase Realtime | Chat, notificaciones live, estado eventos |
| Email | Resend | Emails transaccionales |
| Pagos | Stripe | Comisiones, suscripciones dealers |
| SMS | Twilio | Verificación, alertas críticas |
| KYC | Veriff o Onfido | Verificación de identidad |

### 4.2 Opción ALTERNATIVA: AWS (Escalabilidad a Largo Plazo)

**Justificación:** Mayor control, escalabilidad enterprise, pero requiere más tiempo de setup y experiencia DevOps.

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTE                                │
│              CloudFront CDN → Next.js on AWS Amplify          │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    AWS APPLICATION LAYER                      │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │ API Gateway  │  │   Lambda     │  │  AppSync         │  │
│  │ (REST)       │  │ (Functions)  │  │  (GraphQL+RT)    │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    AWS DATA LAYER                             │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌────────┐  ┌─────────────┐  │
│  │ RDS      │  │ Cognito  │  │  S3    │  │ ElastiCache │  │
│  │(Postgres)│  │ (Auth)   │  │(Files) │  │  (Redis)    │  │
│  └──────────┘  └──────────┘  └────────┘  └─────────────┘  │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌────────────────────────────┐│
│  │   SES    │  │   SNS    │  │  EventBridge (CRON/Events) ││
│  │ (Email)  │  │ (Push)   │  └────────────────────────────┘│
│  └──────────┘  └──────────┘                                 │
└─────────────────────────────────────────────────────────────┘
```

### 4.3 Comparativa de Opciones

| Criterio | Supabase + Vercel | AWS Full |
|---|---|---|
| Tiempo al mercado | ⭐⭐⭐⭐⭐ (2-3 meses) | ⭐⭐⭐ (4-6 meses) |
| Costo inicial | ~$50-150/mes | ~$200-500/mes |
| Escalabilidad | Buena (hasta ~50K usuarios) | Excelente (millones) |
| Complejidad DevOps | Baja | Alta |
| Vendor lock-in | Medio (PostgreSQL estándar) | Alto (servicios propietarios) |
| Equipo requerido | 1-2 desarrolladores | 2-4 + DevOps |
| Migración futura | Fácil salir (SQL estándar) | Complejo |
| Soporte regional (CR) | Bueno (región US) | Excelente (región us-east) |

### 4.4 Recomendación

**Iniciar con Supabase + Vercel** para llegar al mercado en 3-4 meses. Planificar migración a AWS solo si se superan los 10,000 usuarios activos mensuales o si requisitos enterprise lo demandan. La base de datos PostgreSQL hace la migración viable.

---

## 5. Diseño de Base de Datos

### 5.1 Modelo Entidad-Relación

```
┌─────────────┐       ┌─────────────┐       ┌─────────────┐
│   profiles  │       │   dealers   │       │  vehicles   │
│─────────────│       │─────────────│       │─────────────│
│ id (UUID)   │◄──┐   │ id (UUID)   │◄──────│ dealer_id   │
│ user_id(FK) │   │   │ user_id(FK) │       │ id (UUID)   │
│ full_name   │   │   │ business_nm │       │ make/model  │
│ phone       │   │   │ approval    │       │ year/price  │
│ role        │   │   │ tax_id      │       │ status      │
│ verified    │   │   └─────────────┘       │ vin         │
│ budget_min  │   │                          └──────┬──────┘
│ budget_max  │   │                                 │
│ preferences │   │   ┌─────────────┐               │
└─────────────┘   │   │   events    │               │
                  │   │─────────────│               │
                  │   │ id (UUID)   │◄──────────────┤
                  │   │ name        │               │
                  │   │ start_date  │   ┌───────────┴───┐
                  │   │ end_date    │   │event_vehicles │
                  │   │ status      │   │(junction)     │
                  │   └──────┬──────┘   └───────────────┘
                  │          │
                  │          ▼
                  │   ┌─────────────┐       ┌─────────────┐
                  │   │   offers    │       │    leads    │
                  │   │─────────────│       │─────────────│
                  └──►│ buyer_id    │──────►│ buyer_id    │
                      │ vehicle_id  │       │ vehicle_id  │
                      │ event_id    │       │ dealer_id   │
                      │ amount      │       │ offer_id    │
                      │ status      │       │ score/level │
                      └─────────────┘       │ status      │
                                            │ unlocked    │
                                            └─────────────┘
```

### 5.2 Esquema Detallado (PostgreSQL)

#### Tabla: `profiles`
| Columna | Tipo | Constraints | Descripción |
|---|---|---|---|
| id | UUID | PK, DEFAULT gen_random_uuid() | Identificador único |
| user_id | UUID | FK → auth.users, UNIQUE, NOT NULL | Referencia a Supabase Auth |
| full_name | VARCHAR(255) | NOT NULL | Nombre completo |
| email | VARCHAR(255) | UNIQUE, NOT NULL | Email (mirror de auth) |
| phone | VARCHAR(20) | | Teléfono |
| role | ENUM('buyer','dealer','admin') | NOT NULL, DEFAULT 'buyer' | Rol del usuario |
| verification_status | ENUM('unverified','pending','verified','rejected') | DEFAULT 'unverified' | Estado KYC |
| budget_range_min | DECIMAL(12,2) | | Presupuesto mínimo (CRC) |
| budget_range_max | DECIMAL(12,2) | | Presupuesto máximo (CRC) |
| vehicle_preferences | JSONB | DEFAULT '{}' | Preferencias de vehículo |
| profile_completeness | INTEGER | DEFAULT 0, CHECK(0-100) | % de perfil completo |
| avatar_url | TEXT | | URL de foto de perfil |
| created_at | TIMESTAMPTZ | DEFAULT now() | Fecha de creación |
| updated_at | TIMESTAMPTZ | DEFAULT now() | Última actualización |

#### Tabla: `dealers`
| Columna | Tipo | Constraints | Descripción |
|---|---|---|---|
| id | UUID | PK | Identificador único |
| user_id | UUID | FK → profiles.id, UNIQUE | Perfil asociado |
| business_name | VARCHAR(255) | NOT NULL | Nombre comercial |
| legal_name | VARCHAR(255) | | Razón social |
| tax_id | VARCHAR(20) | UNIQUE | Cédula jurídica |
| contact_email | VARCHAR(255) | NOT NULL | Email de contacto |
| contact_phone | VARCHAR(20) | | Teléfono comercial |
| business_address | TEXT | | Dirección física |
| province | VARCHAR(50) | | Provincia |
| canton | VARCHAR(50) | | Cantón |
| approval_status | ENUM('pending','approved','rejected','suspended') | DEFAULT 'pending' | Estado de aprobación |
| subscription_tier | ENUM('basic','premium','enterprise') | DEFAULT 'basic' | Plan de suscripción |
| vehicle_count | INTEGER | DEFAULT 0 | Conteo de vehículos |
| lead_count | INTEGER | DEFAULT 0 | Leads totales recibidos |
| created_at | TIMESTAMPTZ | DEFAULT now() | |
| updated_at | TIMESTAMPTZ | DEFAULT now() | |

#### Tabla: `vehicles`
| Columna | Tipo | Constraints | Descripción |
|---|---|---|---|
| id | UUID | PK | Identificador único |
| dealer_id | UUID | FK → dealers.id, NOT NULL | Dealer propietario |
| make | VARCHAR(50) | NOT NULL | Marca |
| model | VARCHAR(100) | NOT NULL | Modelo |
| year | INTEGER | NOT NULL, CHECK(1900-2030) | Año |
| mileage | INTEGER | CHECK(≥0) | Kilometraje |
| fuel_type | ENUM('gasoline','diesel','hybrid','electric') | NOT NULL | Tipo de combustible |
| transmission | ENUM('automatic','manual','cvt') | NOT NULL | Transmisión |
| engine | VARCHAR(50) | | Motor |
| color | VARCHAR(30) | | Color |
| vin | VARCHAR(17) | UNIQUE | VIN |
| body_type | ENUM('sedan','suv','truck','coupe','hatchback','van','convertible') | | Tipo de carrocería |
| price | DECIMAL(12,2) | NOT NULL | Precio (CRC) |
| description | TEXT | | Descripción |
| status | ENUM('draft','pending_approval','active','assigned_to_event','sold','closed') | DEFAULT 'draft' | Estado |
| views | INTEGER | DEFAULT 0 | Vistas |
| featured | BOOLEAN | DEFAULT false | Destacado |
| created_at | TIMESTAMPTZ | DEFAULT now() | |
| updated_at | TIMESTAMPTZ | DEFAULT now() | |

#### Tabla: `vehicle_images`
| Columna | Tipo | Constraints | Descripción |
|---|---|---|---|
| id | UUID | PK | |
| vehicle_id | UUID | FK → vehicles.id, ON DELETE CASCADE | |
| storage_path | TEXT | NOT NULL | Path en Supabase Storage |
| position | INTEGER | DEFAULT 0 | Orden de la imagen |
| is_primary | BOOLEAN | DEFAULT false | Imagen principal |
| created_at | TIMESTAMPTZ | DEFAULT now() | |

#### Tabla: `events`
| Columna | Tipo | Constraints | Descripción |
|---|---|---|---|
| id | UUID | PK | |
| name | VARCHAR(255) | NOT NULL | Nombre del evento |
| description | TEXT | | Descripción |
| start_date | TIMESTAMPTZ | NOT NULL | Inicio |
| end_date | TIMESTAMPTZ | NOT NULL | Fin |
| status | ENUM('scheduled','active','closed','in_review','finished') | DEFAULT 'scheduled' | Estado |
| max_vehicles | INTEGER | DEFAULT 50 | Máximo de vehículos |
| created_by | UUID | FK → profiles.id | Admin que creó |
| created_at | TIMESTAMPTZ | DEFAULT now() | |
| updated_at | TIMESTAMPTZ | DEFAULT now() | |

#### Tabla: `event_vehicles` (Junction)
| Columna | Tipo | Constraints |
|---|---|---|
| event_id | UUID | FK → events.id, PK compuesta |
| vehicle_id | UUID | FK → vehicles.id, PK compuesta |
| added_at | TIMESTAMPTZ | DEFAULT now() |

#### Tabla: `offers`
| Columna | Tipo | Constraints | Descripción |
|---|---|---|---|
| id | UUID | PK | |
| buyer_id | UUID | FK → profiles.id, NOT NULL | Comprador |
| vehicle_id | UUID | FK → vehicles.id, NOT NULL | Vehículo |
| event_id | UUID | FK → events.id, NOT NULL | Evento |
| amount | DECIMAL(12,2) | NOT NULL, CHECK(>0) | Monto ofertado (CRC) |
| submission_date | TIMESTAMPTZ | DEFAULT now() | Fecha de oferta |
| status | ENUM('pending','accepted','rejected','withdrawn','expired') | DEFAULT 'pending' | Estado |
| notes | TEXT | | Notas del comprador |
| created_at | TIMESTAMPTZ | DEFAULT now() | |

#### Tabla: `leads`
| Columna | Tipo | Constraints | Descripción |
|---|---|---|---|
| id | UUID | PK | |
| buyer_id | UUID | FK → profiles.id | |
| vehicle_id | UUID | FK → vehicles.id | |
| dealer_id | UUID | FK → dealers.id | |
| event_id | UUID | FK → events.id | |
| offer_id | UUID | FK → offers.id | |
| score | DECIMAL(5,2) | CHECK(0-100) | Score calculado |
| level | ENUM('priority','hot','warm','cold') | | Nivel del lead |
| reasons | JSONB | DEFAULT '[]' | Razones del score |
| status | ENUM('new','contacted','negotiating','converted','lost') | DEFAULT 'new' | Estado del lead |
| release_status | ENUM('unreleased','released','expired') | DEFAULT 'unreleased' | Estado de liberación |
| is_unlocked | BOOLEAN | DEFAULT false | Si el dealer ya ve los datos |
| unlocked_at | TIMESTAMPTZ | | Fecha de unlock |
| created_at | TIMESTAMPTZ | DEFAULT now() | |
| updated_at | TIMESTAMPTZ | DEFAULT now() | |

#### Tabla: `messages`
| Columna | Tipo | Constraints | Descripción |
|---|---|---|---|
| id | UUID | PK | |
| thread_id | UUID | NOT NULL, INDEX | Hilo de conversación |
| sender_id | UUID | FK → profiles.id | |
| text | TEXT | NOT NULL | Contenido |
| read | BOOLEAN | DEFAULT false | Leído |
| created_at | TIMESTAMPTZ | DEFAULT now() | |

#### Tabla: `chat_threads`
| Columna | Tipo | Constraints | Descripción |
|---|---|---|---|
| id | UUID | PK | |
| participant_1 | UUID | FK → profiles.id | |
| participant_2 | UUID | FK → profiles.id | |
| lead_id | UUID | FK → leads.id | Lead asociado |
| last_message_at | TIMESTAMPTZ | | Último mensaje |
| created_at | TIMESTAMPTZ | DEFAULT now() | |

### 5.3 Índices Recomendados

```sql
-- Performance crítica
CREATE INDEX idx_vehicles_dealer ON vehicles(dealer_id);
CREATE INDEX idx_vehicles_status ON vehicles(status);
CREATE INDEX idx_vehicles_make_model ON vehicles(make, model);
CREATE INDEX idx_offers_buyer ON offers(buyer_id);
CREATE INDEX idx_offers_event ON offers(event_id);
CREATE INDEX idx_offers_vehicle ON offers(vehicle_id);
CREATE INDEX idx_leads_dealer ON leads(dealer_id);
CREATE INDEX idx_leads_event ON leads(event_id);
CREATE INDEX idx_leads_score ON leads(score DESC);
CREATE INDEX idx_messages_thread ON messages(thread_id, created_at DESC);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_dates ON events(start_date, end_date);
```

### 5.4 Row Level Security (RLS) — Políticas Clave

```sql
-- Buyers solo ven sus propias ofertas
CREATE POLICY "buyers_own_offers" ON offers
  FOR SELECT USING (buyer_id = auth.uid());

-- Dealers solo ven leads asignados a ellos
CREATE POLICY "dealers_own_leads" ON leads
  FOR SELECT USING (dealer_id IN (
    SELECT id FROM dealers WHERE user_id = auth.uid()
  ));

-- Datos de comprador ocultos si lead no está unlocked
CREATE POLICY "privacy_buyer_data" ON profiles
  FOR SELECT USING (
    id = auth.uid()  -- Siempre ves tu propio perfil
    OR role = 'admin'  -- Admin ve todo
    OR EXISTS (  -- Dealer solo si lead está unlocked
      SELECT 1 FROM leads
      WHERE leads.buyer_id = profiles.id
      AND leads.is_unlocked = true
      AND leads.dealer_id IN (SELECT id FROM dealers WHERE user_id = auth.uid())
    )
  );
```

---

## 6. Autenticación y Autorización

### 6.1 Estrategia de Autenticación

**Proveedor:** Supabase Auth (basado en GoTrue)

| Método | Prioridad | Descripción |
|---|---|---|
| Email + Password | 🔴 MVP | Registro estándar con confirmación por email |
| Google OAuth | 🟡 Fase 2 | Login social (popular en CR) |
| Magic Link | 🟡 Fase 2 | Login sin contraseña por email |
| SMS OTP | 🟠 Fase 3 | Verificación por SMS (Twilio) |
| MFA (TOTP) | 🟠 Fase 3 | Factor adicional para dealers y admin |

### 6.2 Flujo de Registro por Rol

**Comprador:**
1. Registro con email/password → Email de confirmación
2. Verificación de email → Acceso básico (explorar, watchlist)
3. Completar perfil (teléfono, preferencias) → Puede hacer ofertas
4. KYC opcional → Mejora lead score

**Dealer:**
1. Registro con email/password → Email de confirmación
2. Completar datos de negocio (cédula jurídica, dirección, etc.)
3. Subir documentos (patente, personería) → Estado "pending"
4. Admin revisa y aprueba → Estado "approved" → Puede publicar vehículos

**Admin:**
- Creado manualmente por super-admin
- Requiere MFA obligatorio

### 6.3 RBAC (Role-Based Access Control)

| Recurso | Buyer | Dealer | Admin |
|---|---|---|---|
| Ver inventario público | ✅ | ✅ | ✅ |
| Hacer ofertas | ✅ | ❌ | ❌ |
| Ver sus propias ofertas | ✅ | ❌ | ✅ (todas) |
| Publicar vehículos | ❌ | ✅ | ✅ |
| Ver leads asignados | ❌ | ✅ | ✅ (todos) |
| Desbloquear datos buyer | ❌ | ✅ (sus leads) | ✅ |
| Gestionar eventos | ❌ | ❌ | ✅ |
| Aprobar dealers | ❌ | ❌ | ✅ |
| Aprobar vehículos | ❌ | ❌ | ✅ |
| Configurar scoring | ❌ | ❌ | ✅ |
| Ver audit log | ❌ | ❌ | ✅ |

### 6.4 Implementación en Next.js Middleware

```typescript
// middleware.ts - Protección de rutas
const ROLE_ROUTES = {
  buyer: ['/buyer'],
  dealer: ['/dealer'],
  admin: ['/admin'],
};

// Middleware verifica:
// 1. Token JWT válido (Supabase session)
// 2. Rol del usuario coincide con la ruta
// 3. Dealer tiene approval_status = 'approved' para rutas de dealer
// 4. Redirige a /login si no autenticado
// 5. Redirige a /unauthorized si rol incorrecto
```

### 6.5 Gestión de Sesiones

- **Token refresh:** Automático via Supabase client SDK
- **Session duration:** 1 hora (access token), 7 días (refresh token)
- **Logout:** Revocación de refresh token + limpieza client-side
- **Multi-dispositivo:** Permitido (sesiones independientes)

---

## 7. API y Capa de Servicios

### 7.1 Estructura de API Routes (Next.js App Router)

```
/src/app/api/
├── auth/
│   ├── register/route.ts        POST - Registro de usuario
│   ├── callback/route.ts        GET  - OAuth callback
│   └── profile/route.ts         GET/PUT - Perfil del usuario
├── vehicles/
│   ├── route.ts                 GET (list) / POST (create)
│   ├── [id]/route.ts            GET / PUT / DELETE
│   ├── [id]/images/route.ts     POST (upload) / DELETE
│   └── [id]/approve/route.ts    POST (admin)
├── events/
│   ├── route.ts                 GET / POST
│   ├── [id]/route.ts            GET / PUT
│   ├── [id]/vehicles/route.ts   GET / POST / DELETE
│   └── [id]/close/route.ts      POST (admin - trigger scoring)
├── offers/
│   ├── route.ts                 GET / POST
│   ├── [id]/route.ts            GET / PUT
│   └── [id]/withdraw/route.ts   POST
├── leads/
│   ├── route.ts                 GET (filtered by role)
│   ├── [id]/route.ts            GET
│   ├── [id]/unlock/route.ts     POST (dealer pays)
│   └── [id]/status/route.ts     PUT
├── dealers/
│   ├── route.ts                 GET / POST
│   ├── [id]/route.ts            GET / PUT
│   └── [id]/approve/route.ts    POST (admin)
├── chat/
│   ├── threads/route.ts         GET / POST
│   └── threads/[id]/messages/route.ts  GET / POST
├── admin/
│   ├── dashboard/route.ts       GET (stats)
│   ├── scoring/route.ts         GET / PUT (weights)
│   └── audit/route.ts           GET (audit log)
└── webhooks/
    ├── stripe/route.ts          POST (payment events)
    └── supabase/route.ts        POST (auth events)
```

### 7.2 Patrones de Diseño de API

**Respuesta Estándar:**
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
  meta?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
```

**Paginación:** Offset-based con `?page=1&pageSize=20`  
**Filtros:** Query params `?status=active&make=Toyota&minPrice=5000000`  
**Ordenamiento:** `?sort=price&order=desc`  
**Validación:** Zod schemas en cada endpoint  

### 7.3 Servicios de Negocio (Server-Side)

| Servicio | Responsabilidad |
|---|---|
| `VehicleService` | CRUD vehículos, aprobación, asignación a eventos |
| `EventService` | Gestión de eventos, ciclo de vida, cierre |
| `OfferService` | Crear/retirar ofertas, validar reglas de negocio |
| `LeadScoringService` | Cálculo de scores, generación de leads al cerrar evento |
| `LeadService` | Gestión de leads, unlock, cambios de estado |
| `DealerService` | Onboarding, aprobación, gestión de suscripción |
| `NotificationService` | Despacho de notificaciones (email, push, in-app) |
| `AuditService` | Registro de todas las acciones administrativas |
| `PaymentService` | Procesamiento de pagos, webhooks Stripe |

### 7.4 Validación con Zod

```typescript
// Ejemplo: Schema de creación de oferta
const CreateOfferSchema = z.object({
  vehicleId: z.string().uuid(),
  eventId: z.string().uuid(),
  amount: z.number().positive().min(100000), // Mínimo ₡100,000
  notes: z.string().max(500).optional(),
});
```

---

## 8. Sistema de Eventos en Tiempo Real

### 8.1 Casos de Uso para Tiempo Real

| Funcionalidad | Canal | Prioridad |
|---|---|---|
| Chat entre buyer-dealer | Por thread/lead | 🔴 Crítica |
| Contador de ofertas en evento activo | Por evento | 🔴 Crítica |
| Notificación de nuevo lead | Por dealer | 🟡 Alta |
| Estado de evento (apertura/cierre) | Broadcast | 🟡 Alta |
| Cambio de estado de oferta | Por buyer | 🟡 Alta |
| Actividad en watchlist | Por buyer | 🟠 Media |
| Dashboard admin (stats live) | Admin-only | 🟢 Nice-to-have |

### 8.2 Implementación con Supabase Realtime

```typescript
// Suscripción a mensajes de chat
const channel = supabase
  .channel(`chat:${threadId}`)
  .on('postgres_changes', {
    event: 'INSERT',
    schema: 'public',
    table: 'messages',
    filter: `thread_id=eq.${threadId}`,
  }, (payload) => {
    // Nuevo mensaje recibido
    addMessage(payload.new as Message);
  })
  .subscribe();

// Suscripción a estado de evento
const eventChannel = supabase
  .channel(`event:${eventId}`)
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'events',
    filter: `id=eq.${eventId}`,
  }, (payload) => {
    // Evento cambió de estado
    updateEventStatus(payload.new.status);
  })
  .subscribe();
```

### 8.3 Arquitectura de Canales

```
┌─────────────────────────────────────────────┐
│              SUPABASE REALTIME               │
│                                              │
│  ┌───────────────────────────────────────┐  │
│  │ Broadcast Channels (efímeros)          │  │
│  │  • event:{id}:offers-count            │  │
│  │  • event:{id}:status                  │  │
│  └───────────────────────────────────────┘  │
│                                              │
│  ┌───────────────────────────────────────┐  │
│  │ Postgres Changes (persistentes)        │  │
│  │  • messages (INSERT → chat)           │  │
│  │  • leads (INSERT → dealer notif)      │  │
│  │  • offers (UPDATE → buyer notif)      │  │
│  │  • events (UPDATE → status change)    │  │
│  └───────────────────────────────────────┘  │
│                                              │
│  ┌───────────────────────────────────────┐  │
│  │ Presence (quién está online)           │  │
│  │  • chat:{threadId} → typing indicator │  │
│  └───────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

### 8.4 Optimización y Límites

- **Conexiones simultáneas:** Supabase Free = 200, Pro = 500, Enterprise = ilimitado
- **Rate limiting:** Max 100 mensajes/segundo por canal
- **Reconexión:** Automática con backoff exponencial (SDK lo maneja)
- **Cleanup:** Desuscribir canales al desmontar componentes (useEffect cleanup)
- **Fallback:** Si Realtime no disponible, polling cada 5s como degradación

---

## 9. Sistema de Lead Scoring

### 9.1 Algoritmo Actual (A Preservar)

El MVP ya implementa la lógica core de scoring que se trasladará al backend:

```typescript
// Pesos configurables por admin (deben sumar 100)
interface ScoringWeights {
  offerAmount: number;    // 40% - Monto de la oferta vs precio del vehículo
  verification: number;   // 25% - Estado de verificación KYC del buyer
  profileCompleteness: number; // 20% - Completitud del perfil
  timing: number;         // 15% - Qué tan temprano ofertó
}

// Niveles resultantes
// Priority: 80-100 (lead premium, contacto inmediato)
// Hot:      60-79  (lead caliente, alta probabilidad)
// Warm:     40-59  (lead tibio, seguimiento necesario)
// Cold:      0-39  (lead frío, baja probabilidad)
```

### 9.2 Mejoras para Producción

| Mejora | Descripción | Impacto |
|---|---|---|
| **Historial de ofertas** | Considerar ofertas previas del buyer en otros eventos | Mejor predicción |
| **Engagement score** | Tiempo en plataforma, vehículos vistos, watchlist | Señal de intención |
| **Geolocalización** | Proximidad buyer-dealer | Logística realista |
| **Capacidad financiera** | Verificación de fondos o pre-aprobación | Calidad del lead |
| **Penalización por no-show** | Buyers que nunca contactan bajan score futuro | Calidad general |
| **Machine Learning (Fase 3)** | Modelo predictivo basado en conversiones históricas | Optimización continua |

### 9.3 Proceso de Scoring en Producción

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│ Evento       │     │ Scoring      │     │ Leads        │
│ se cierra    │────►│ Job (async)  │────►│ generados    │
│              │     │              │     │              │
└──────────────┘     └──────┬───────┘     └──────┬───────┘
                            │                     │
                            ▼                     ▼
                     ┌──────────────┐     ┌──────────────┐
                     │ Calcular     │     │ Notificar    │
                     │ score por    │     │ dealers      │
                     │ cada oferta  │     │ (email+push) │
                     └──────────────┘     └──────────────┘
```

**Ejecución:** Supabase Edge Function triggered por cambio de estado del evento a `closed`.

### 9.4 Configuración de Pesos (Admin)

- Admin puede ajustar pesos desde `/admin/settings`
- Validación: todos los pesos entre 0-100 y suma exacta de 100
- Cambios se aplican solo a eventos futuros (no retroactivo)
- Audit log registra cada cambio de configuración

---

## 10. Modelo de Privacidad y Revelación de Datos

### 10.1 Principio Fundamental

Fair Value opera con un modelo de **privacidad progresiva**: la información se revela gradualmente conforme avanza el ciclo de negocio.

### 10.2 Matriz de Visibilidad por Estado

| Dato | Durante Evento | Post-Evento (Lead No Unlocked) | Post-Evento (Lead Unlocked) |
|---|---|---|---|
| **Nombre del Buyer** | ❌ Oculto | ❌ Oculto | ✅ Visible para Dealer |
| **Email del Buyer** | ❌ Oculto | ❌ Oculto | ✅ Visible para Dealer |
| **Teléfono del Buyer** | ❌ Oculto | ❌ Oculto | ✅ Visible para Dealer |
| **Monto de Oferta** | ❌ Oculto | ✅ Visible (solo monto) | ✅ Visible |
| **Lead Score** | ❌ No calculado | ✅ Visible para Dealer | ✅ Visible |
| **Identidad del Dealer** | ❌ Oculto para Buyer | ❌ Oculto para Buyer | ✅ Visible para Buyer |
| **Precio del Vehículo** | ✅ Visible | ✅ Visible | ✅ Visible |
| **Datos del Vehículo** | ✅ Visible | ✅ Visible | ✅ Visible |
| **Nombre del Evento** | ✅ Visible | ✅ Visible | ✅ Visible |

### 10.3 Implementación Técnica

**Nivel de Base de Datos (RLS):**
- Políticas PostgreSQL que filtran datos según rol y estado del lead
- Campos sensibles devueltos como `null` si no autorizado

**Nivel de API:**
- Serializers que excluyen campos según contexto
- Endpoint específico para "unlock" que verifica pago

**Nivel de Frontend:**
- Componentes que muestran placeholders ("Comprador Verificado #XXX")
- UI de "desbloquear" con confirmación de pago

### 10.4 Flujo de Revelación (Unlock)

```
1. Evento cierra → Leads se generan con scores
2. Dealer ve lista de leads (score, nivel, razones) — SIN datos personales
3. Dealer selecciona lead → Trigger de pago (comisión por lead)
4. Pago confirmado → lead.is_unlocked = true
5. Datos del buyer visibles para el dealer
6. Datos del dealer visibles para el buyer
7. Chat habilitado entre ambas partes
```

### 10.5 Consentimiento y GDPR-like

- Buyer acepta términos al registrarse (consentimiento informado)
- Datos solo se comparten con dealers que pagan por el lead
- Buyer puede solicitar eliminación de datos (derecho al olvido)
- Logs de acceso a datos personales (audit trail)

---

## 11. Gestión de Imágenes y Archivos

### 11.1 Tipos de Archivos

| Tipo | Fuente | Formato | Tamaño Max | Almacenamiento |
|---|---|---|---|---|
| Fotos de vehículos | Dealer upload | JPEG, PNG, WebP | 5MB por imagen | Supabase Storage / público |
| Documentos KYC (buyer) | Buyer upload | PDF, JPEG, PNG | 10MB | Supabase Storage / privado |
| Documentos dealer | Dealer upload | PDF | 10MB | Supabase Storage / privado |
| Avatares de perfil | User upload | JPEG, PNG | 2MB | Supabase Storage / público |
| Logo del dealer | Dealer upload | PNG, SVG | 1MB | Supabase Storage / público |

### 11.2 Arquitectura de Storage

```
supabase-storage/
├── vehicles/                    # Bucket público
│   ├── {dealer_id}/
│   │   ├── {vehicle_id}/
│   │   │   ├── main.webp       # Imagen principal (optimizada)
│   │   │   ├── 1.webp
│   │   │   ├── 2.webp
│   │   │   └── thumbs/
│   │   │       ├── main_400.webp
│   │   │       └── main_800.webp
├── avatars/                     # Bucket público
│   └── {user_id}.webp
├── kyc-documents/               # Bucket PRIVADO (RLS)
│   └── {user_id}/
│       ├── id-front.pdf
│       └── id-back.pdf
└── dealer-documents/            # Bucket PRIVADO (RLS)
    └── {dealer_id}/
        ├── patente.pdf
        ├── personeria.pdf
        └── cedula-juridica.pdf
```

### 11.3 Pipeline de Procesamiento de Imágenes

```
Upload → Validación → Optimización → Storage → CDN
         (tipo, size)  (resize, webp)  (Supabase)  (Vercel/CF)
```

**Procesamiento (Edge Function):**
1. Validar tipo MIME y tamaño
2. Escanear virus/malware (ClamAV o servicio cloud)
3. Convertir a WebP (calidad 85%)
4. Generar thumbnails (400px, 800px)
5. Almacenar en bucket correspondiente
6. Retornar URLs públicas o signed URLs (privados)

### 11.4 Migración del Image Provider

El MVP actual usa un `imageProvider.ts` centralizado que resuelve URLs de Unsplash. Para producción:

```typescript
// Actual (MVP):
getImageUrl('vehicle', vehicleId) → URL de Unsplash

// Producción:
getImageUrl('vehicle', vehicleId) → URL de Supabase Storage CDN
// La interfaz del Image Provider se mantiene — solo cambia la implementación interna
```

**Ventaja:** La abstracción existente facilita la migración sin tocar componentes.

---

## 12. Sistema de Chat y Mensajería

### 12.1 Reglas de Negocio del Chat

| Regla | Descripción |
|---|---|
| Chat solo post-unlock | El chat se habilita únicamente cuando un lead está desbloqueado |
| Siempre 1:1 | Solo conversaciones entre un buyer y un dealer |
| Vinculado a lead | Cada thread de chat está asociado a un lead específico |
| Sin datos sensibles | Filtro automático de números de teléfono y emails en mensajes |
| Moderación | Admin puede ver cualquier conversación para resolución de disputas |
| Retención | Mensajes se conservan 12 meses post-cierre |

### 12.2 Arquitectura del Chat

```
┌─────────────┐          ┌──────────────────┐
│   Frontend  │◄────────►│ Supabase Realtime │
│  (React)    │  WS      │   (Postgres CDC)  │
└──────┬──────┘          └────────┬─────────┘
       │                          │
       │ HTTP POST                │ Trigger
       ▼                          ▼
┌─────────────┐          ┌──────────────────┐
│ API Route   │─────────►│   PostgreSQL     │
│ /api/chat   │  INSERT   │   (messages)     │
└─────────────┘          └──────────────────┘
```

**Flujo:**
1. Frontend envía mensaje vía POST a API Route
2. API Route valida (permisos, contenido) e inserta en DB
3. Supabase Realtime detecta INSERT y emite a suscriptores del canal
4. Frontend del receptor recibe el mensaje en tiempo real

### 12.3 Funcionalidades del Chat

| Feature | Fase 1 | Fase 2 | Fase 3 |
|---|---|---|---|
| Mensajes de texto | ✅ | ✅ | ✅ |
| Indicador de "escribiendo" | ❌ | ✅ | ✅ |
| Leído/No leído | ✅ | ✅ | ✅ |
| Adjuntar imágenes | ❌ | ✅ | ✅ |
| Mensajes predefinidos | ❌ | ✅ | ✅ |
| Búsqueda en conversación | ❌ | ❌ | ✅ |
| Notificación push de mensaje | ❌ | ✅ | ✅ |
| Bot de bienvenida | ❌ | ❌ | ✅ |

### 12.4 Moderación y Filtros

- **Filtro de contacto directo:** Regex que detecta números de teléfono, emails, URLs externas
- **Palabras prohibidas:** Lista configurable por admin
- **Reportar mensaje:** Buyer o dealer puede reportar; admin revisa
- **Bloqueo temporal:** Admin puede suspender chat de un usuario

---

## 13. Verificación de Identidad (KYC)

### 13.1 Niveles de Verificación

| Nivel | Requisitos | Beneficios | Rol |
|---|---|---|---|
| **Nivel 0** — Sin verificar | Solo email confirmado | Explorar, watchlist | Buyer |
| **Nivel 1** — Básico | Teléfono verificado + perfil completo | Hacer ofertas | Buyer |
| **Nivel 2** — Verificado | Documento de identidad (cédula/pasaporte) | Score boost (+25pts), badge visible | Buyer |
| **Nivel 3** — Premium | Comprobante financiero | Score máximo, prioridad en leads | Buyer |
| **Dealer Verificado** | Cédula jurídica + patente + personería | Publicar vehículos, recibir leads | Dealer |

### 13.2 Flujo de Verificación (Buyer Nivel 2)

```
1. Buyer accede a /buyer/verification
2. Selecciona tipo de documento (cédula CR, pasaporte, residencia)
3. Sube foto frontal + foto trasera del documento
4. (Opcional) Selfie con documento para liveness check
5. Sistema procesa:
   a. OCR extrae datos del documento
   b. Validación de formato y fecha de expiración
   c. Liveness detection (si selfie)
   d. Cross-reference con datos de perfil
6. Resultado: approved | rejected | manual_review
7. Si approved → verification_status = 'verified', score boost activado
```

### 13.3 Opciones de Proveedor KYC

| Proveedor | Cobertura CR | Costo/verificación | Características |
|---|---|---|---|
| **Veriff** | ✅ Cédula CR | $1-2 USD | OCR, liveness, 195 países |
| **Onfido** | ✅ Cédula CR | $2-3 USD | AI-powered, SDK mobile |
| **Jumio** | ✅ Cédula CR | $3-5 USD | Enterprise, regulado |
| **Manual (Fase 1)** | ✅ | Solo tiempo admin | Upload + revisión humana |

**Recomendación:** Iniciar con verificación **manual** (admin revisa documentos) para validar el proceso. Migrar a Veriff cuando el volumen supere 50 verificaciones/semana.

### 13.4 Verificación de Dealers

| Documento | Obligatorio | Validación |
|---|---|---|
| Cédula jurídica | ✅ | Formato XX-XXXX-XXXXXX, consulta CCSS |
| Patente comercial | ✅ | Documento vigente |
| Personería jurídica | ✅ | Menos de 3 meses de emitida |
| Cédula del representante legal | ✅ | Match con datos de registro |
| Fotos del establecimiento | 🟡 Opcional | Mínimo 3 fotos del local |

### 13.5 Almacenamiento Seguro de Documentos KYC

- Bucket privado con RLS (solo el usuario y admin)
- Encriptación at-rest (AES-256)
- Signed URLs con expiración de 1 hora para visualización
- Retención máxima: 5 años post-última actividad
- Audit log de cada acceso a documentos

---

## 14. Notificaciones

### 14.1 Canales de Notificación

| Canal | Tecnología | Caso de Uso |
|---|---|---|
| **In-app** | Supabase Realtime + DB | Todas las notificaciones |
| **Email** | Resend (o SendGrid) | Transaccional + resúmenes |
| **Push (Web)** | Web Push API + Service Worker | Mensajes, leads nuevos |
| **SMS** | Twilio | Verificación OTP, alertas críticas |

### 14.2 Eventos que Generan Notificaciones

| Evento | In-App | Email | Push | SMS |
|---|---|---|---|---|
| Registro exitoso | ✅ | ✅ (bienvenida) | ❌ | ❌ |
| Evento próximo a iniciar | ✅ | ✅ | ✅ | ❌ |
| Evento iniciado | ✅ | ✅ | ✅ | ❌ |
| Oferta recibida (buyer confirm) | ✅ | ✅ | ❌ | ❌ |
| Evento cerrado | ✅ | ✅ | ✅ | ❌ |
| Nuevo lead generado (dealer) | ✅ | ✅ | ✅ | ✅ |
| Lead desbloqueado (buyer) | ✅ | ✅ | ✅ | ❌ |
| Nuevo mensaje de chat | ✅ | ❌ | ✅ | ❌ |
| Vehículo aprobado (dealer) | ✅ | ✅ | ❌ | ❌ |
| Dealer aprobado | ✅ | ✅ | ❌ | ✅ |
| Dealer rechazado | ✅ | ✅ | ❌ | ❌ |
| Pago recibido/fallido | ✅ | ✅ | ❌ | ✅ |
| Vehículo en watchlist cambia | ✅ | ❌ | ✅ | ❌ |

### 14.3 Arquitectura de Notificaciones

```
┌──────────────┐     ┌──────────────────┐     ┌──────────────┐
│ Evento de    │     │ NotificationSvc  │     │   Canales    │
│ Negocio      │────►│                  │────►│              │
│              │     │ • Determinar     │     │ • In-App DB  │
└──────────────┘     │   destinatarios  │     │ • Resend API │
                     │ • Aplicar prefs  │     │ • Web Push   │
                     │ • Renderizar     │     │ • Twilio SMS │
                     │   templates      │     └──────────────┘
                     └──────────────────┘
```

### 14.4 Preferencias del Usuario

Cada usuario puede configurar:
- Canales habilitados por tipo de notificación
- Horario de "no molestar" (ej: 10pm - 7am)
- Frecuencia de resúmenes por email (diario, semanal, nunca)
- Idioma de las notificaciones (español por defecto)

---

## 15. Pagos y Monetización

### 15.1 Modelo de Negocio

| Fuente de Ingreso | Descripción | Fase |
|---|---|---|
| **Comisión por lead** | Dealer paga por desbloquear datos de cada lead | Fase 1 (core) |
| **Suscripción dealer** | Plan mensual por nivel de servicio | Fase 2 |
| **Vehículos destacados** | Pago para posicionar vehículo en top del evento | Fase 2 |
| **Publicidad** | Banners y contenido patrocinado | Fase 3 |

### 15.2 Estructura de Precios (Propuesta)

| Concepto | Precio (CRC) | Precio (USD aprox) |
|---|---|---|
| Lead Priority (unlock) | ₡15,000 - ₡25,000 | $28 - $47 |
| Lead Hot (unlock) | ₡10,000 - ₡15,000 | $19 - $28 |
| Lead Warm (unlock) | ₡5,000 - ₡10,000 | $9 - $19 |
| Lead Cold (unlock) | ₡3,000 - ₡5,000 | $6 - $9 |
| Suscripción Basic | ₡25,000/mes | $47/mes |
| Suscripción Premium | ₡75,000/mes | $140/mes |
| Vehículo destacado | ₡5,000/evento | $9/evento |

### 15.3 Integración con Stripe

**¿Por qué Stripe?**
- Soporta CRC (colones costarricenses)
- Compliance PCI-DSS out-of-the-box
- Webhooks confiables para confirmar pagos
- Stripe Connect para split payments futuro
- Dashboard administrativo incluido

**Flujo de Pago (Lead Unlock):**
```
1. Dealer click "Desbloquear Lead" → Frontend muestra precio
2. Crear Stripe Checkout Session (API Route)
3. Redirect a Stripe → Dealer paga
4. Webhook stripe/checkout.session.completed
5. API marca lead.is_unlocked = true
6. Notificación a buyer ("Un dealer te ha seleccionado")
7. Chat habilitado
```

### 15.4 Facturación (Costa Rica)

- Factura electrónica requerida (Ministerio de Hacienda)
- Integración con proveedor de facturación electrónica (Gosocket, Facture, etc.)
- IVA 13% sobre servicios digitales
- Retención de ISR si aplica

---

## 16. Testing y QA

### 16.1 Estrategia de Testing (Pirámide)

```
            ┌───────────┐
            │   E2E     │  ← 10-15 flujos críticos
            │(Playwright)│
            ├───────────┤
            │Integration│  ← API routes + DB
            │  (Vitest) │
            ├───────────┤
            │   Unit    │  ← Lógica de negocio, utils
            │  (Vitest) │
            └───────────┘
```

### 16.2 Herramientas Recomendadas

| Herramienta | Uso | Justificación |
|---|---|---|
| **Vitest** | Unit + Integration | Nativo para Vite/Next.js, rápido, compatible con Jest API |
| **React Testing Library** | Componentes | Enfoque en comportamiento del usuario |
| **Playwright** | E2E | Cross-browser, screenshots, CI-friendly |
| **MSW (Mock Service Worker)** | API mocking | Intercepta requests en tests de integración |
| **Faker.js** | Data generation | Datos de prueba realistas |
| **Zod** | Schema testing | Validación de contratos API |

### 16.3 Cobertura Mínima Requerida

| Capa | Cobertura Mínima | Archivos Clave |
|---|---|---|
| Lead Scoring | 95% | `leadScoring.ts`, `LeadScoringService` |
| Auth/RBAC | 90% | Middleware, políticas RLS |
| API Routes | 80% | Todos los endpoints |
| Servicios de Negocio | 85% | Event lifecycle, offer rules |
| Componentes UI | 60% | Formularios, flujos críticos |
| E2E Flows | N/A | 10-15 happy paths + edge cases |

### 16.4 Flujos E2E Críticos

1. Registro de buyer → Completar perfil → Hacer oferta
2. Registro de dealer → Subir documentos → Aprobación
3. Dealer publica vehículo → Admin aprueba → Aparece en inventario
4. Evento completo: crear → agregar vehículos → activar → ofertas → cerrar → leads
5. Unlock de lead → Datos revelados → Chat habilitado
6. Pago de lead unlock (Stripe checkout)
7. Verificación KYC (upload + aprobación)
8. Chat entre buyer y dealer
9. Admin ajusta scoring weights → Nuevo evento usa nuevos pesos
10. Dealer ve dashboard con métricas correctas

### 16.5 Testing en CI/CD

```yaml
# Pipeline de testing (GitHub Actions)
test:
  - lint (ESLint + TypeScript)
  - unit tests (Vitest --coverage)
  - integration tests (Vitest + Supabase local)
  - e2e tests (Playwright + preview deploy)
  - lighthouse audit (performance, a11y)
```

---

## 17. Seguridad

### 17.1 Modelo de Amenazas (STRIDE)

| Amenaza | Riesgo para Fair Value | Mitigación |
|---|---|---|
| **Spoofing** (suplantación) | Dealer falso, buyer falso | KYC, verificación de email/teléfono, MFA |
| **Tampering** (manipulación) | Modificar ofertas después de envío | Inmutabilidad de ofertas, audit log |
| **Repudiation** (repudio) | "Yo no hice esa oferta" | Audit trail, timestamps, confirmaciones |
| **Info Disclosure** | Datos de buyer expuestos sin pago | RLS, API authorization, privacidad por diseño |
| **DoS** (denegación) | Sobrecarga durante cierre de evento | Rate limiting, queue processing |
| **Elevation of Privilege** | Buyer se hace admin | RBAC estricto, middleware, RLS |

### 17.2 Controles de Seguridad

| Control | Implementación | Prioridad |
|---|---|---|
| HTTPS obligatorio | Vercel (automático) | 🔴 Día 1 |
| CORS estricto | Next.js config | 🔴 Día 1 |
| Rate limiting | API middleware (token bucket) | 🔴 Día 1 |
| Input validation | Zod en todos los endpoints | 🔴 Día 1 |
| SQL injection prevention | Supabase client (parameterized) | 🔴 Día 1 |
| XSS prevention | React (escaping automático) + CSP headers | 🔴 Día 1 |
| CSRF protection | SameSite cookies + tokens | 🟡 Semana 1 |
| File upload validation | Tipo MIME, tamaño, virus scan | 🟡 Semana 1 |
| Secrets management | Environment variables (Vercel) | 🔴 Día 1 |
| Dependency audit | `npm audit` + Dependabot | 🟡 Semana 2 |
| Penetration testing | Manual o herramienta (OWASP ZAP) | 🟠 Pre-launch |
| Encriptación at-rest | Supabase (automático) | 🔴 Día 1 |
| Backup automático | Supabase (diario, 7 días retención) | 🔴 Día 1 |

### 17.3 Headers de Seguridad (next.config.ts)

```typescript
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
  { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self' 'unsafe-inline'..." },
];
```

### 17.4 Protección de Datos Personales

- Datos de buyer encriptados en reposo (Supabase managed encryption)
- Logs no contienen datos personales (solo IDs)
- Acceso a datos KYC requiere MFA + audit log
- Derecho al olvido: endpoint para eliminación de cuenta
- Data retention policy: 5 años máximo

### 17.5 Rate Limiting por Endpoint

| Endpoint | Límite | Ventana |
|---|---|---|
| POST /api/auth/register | 5 requests | 15 min |
| POST /api/auth/login | 10 requests | 15 min |
| POST /api/offers | 20 requests | 1 hora |
| GET /api/vehicles | 100 requests | 1 min |
| POST /api/chat/messages | 30 requests | 1 min |
| POST /api/leads/unlock | 10 requests | 1 hora |
| Admin endpoints | 200 requests | 1 min |

---

## 18. DevOps y CI/CD

### 18.1 Infraestructura

```
┌────────────────────────────────────────────────────────┐
│                    PRODUCCIÓN                            │
│                                                         │
│  GitHub Repo ──→ Vercel (auto-deploy) ──→ CDN Global   │
│       │                    │                            │
│       │              ┌─────┴─────┐                     │
│       │              │ Preview   │ ← Por cada PR       │
│       │              │ Deploys   │                      │
│       │              └───────────┘                      │
│       │                                                 │
│       └──→ GitHub Actions ──→ Tests ──→ Quality Gate   │
│                                                         │
│  Supabase Cloud ──→ PostgreSQL + Auth + Storage + RT   │
│       │                                                 │
│       ├── Production (branch: main)                     │
│       ├── Staging (branch: develop)                     │
│       └── Local (supabase start)                        │
│                                                         │
│  Servicios Externos:                                    │
│  • Stripe (payments) — sandbox + production             │
│  • Resend (email) — test + production                   │
│  • Veriff (KYC) — sandbox + production                  │
│  • Sentry (errors) — all environments                   │
└────────────────────────────────────────────────────────┘
```

### 18.2 Ambientes

| Ambiente | Branch | URL | Base de Datos | Propósito |
|---|---|---|---|---|
| Local | feature/* | localhost:3000 | Supabase local (Docker) | Desarrollo |
| Preview | PR branches | *.vercel.app | Supabase staging | Code review |
| Staging | develop | staging.fairvalue.cr | Supabase staging | QA + testing |
| Production | main | app.fairvalue.cr | Supabase production | Usuarios reales |

### 18.3 Pipeline CI/CD (GitHub Actions)

```yaml
name: CI/CD Pipeline

on:
  push: [main, develop]
  pull_request: [main, develop]

jobs:
  quality:
    steps:
      - TypeScript type-check (tsc --noEmit)
      - ESLint
      - Prettier check
      
  test:
    steps:
      - Unit tests (Vitest)
      - Integration tests (Supabase local)
      - Coverage report (>80% required)
      
  e2e:
    needs: [quality, test]
    steps:
      - Deploy to preview
      - Playwright E2E tests
      - Lighthouse CI (perf >90, a11y >95)
      
  deploy:
    needs: [e2e]
    if: branch == main
    steps:
      - Vercel production deploy
      - Supabase migrations (if any)
      - Smoke tests post-deploy
      - Notify team (Slack/Discord)
```

### 18.4 Migraciones de Base de Datos

```bash
# Supabase CLI para migraciones
supabase migration new add_vehicle_featured_column
supabase db push          # Apply a staging
supabase db push --linked # Apply a production
```

- Migraciones versionadas en `/supabase/migrations/`
- Revisión manual antes de aplicar a producción
- Rollback scripts para cada migración
- Seed data para ambientes de desarrollo

### 18.5 Monitoreo Post-Deploy

- **Vercel Analytics:** Web Vitals, latencia por ruta
- **Sentry:** Errores JavaScript + server-side
- **Supabase Dashboard:** Queries lentas, conexiones, storage
- **UptimeRobot:** Monitoreo de disponibilidad (ping cada 5 min)
- **Stripe Dashboard:** Estado de pagos, chargebacks

---

## 19. Roadmap de Implementación

### 19.1 Visión General (16 Semanas para MVP de Producción)

```
Mes 1          Mes 2          Mes 3          Mes 4
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│ FASE 1   │  │ FASE 2   │  │ FASE 3   │  │ FASE 4   │
│Foundation│  │ Core Biz │  │ Integr.  │  │ Polish   │
│          │  │ Logic    │  │ + Pagos  │  │ + Launch │
└──────────┘  └──────────┘  └──────────┘  └──────────┘
  S1-S4         S5-S8         S9-S12        S13-S16
```

### 19.2 FASE 1 — Fundamentos (Semanas 1-4)

**Objetivo:** Backend funcional con auth, DB y API básica.

| Semana | Entregables | Dependencias |
|---|---|---|
| **S1** | Setup Supabase (DB + Auth), esquema inicial, migraciones, RLS básica, CI/CD pipeline | Cuenta Supabase, dominio |
| **S2** | API Routes: CRUD usuarios, vehículos, dealers. Zod validation. | S1 |
| **S3** | Auth real: registro, login, roles, middleware de protección, OAuth Google | S1-S2 |
| **S4** | Integración frontend ↔ backend: data fetching, estado global, manejo de errores | S1-S3 |

**Entregable de Fase:** Plataforma con registro real, login, y CRUD de entidades básicas funcionando end-to-end.

### 19.3 FASE 2 — Lógica de Negocio Core (Semanas 5-8)

**Objetivo:** Los flujos principales del producto funcionan con datos reales.

| Semana | Entregables | Dependencias |
|---|---|---|
| **S5** | Gestión de eventos (crear, activar, cerrar), asignación de vehículos a eventos | Fase 1 |
| **S6** | Sistema de ofertas (crear, validar reglas, retirar), modelo de privacidad | S5 |
| **S7** | Lead scoring (migrar lógica a backend), generación de leads al cerrar evento | S5-S6 |
| **S8** | Storage de imágenes (upload vehículos, procesamiento), KYC manual (upload docs) | S5 |

**Entregable de Fase:** Flujo completo de evento: publicar vehículo → evento → ofertas → scoring → leads generados.

### 19.4 FASE 3 — Integraciones y Monetización (Semanas 9-12)

**Objetivo:** Sistemas de pago, chat en tiempo real, y notificaciones.

| Semana | Entregables | Dependencias |
|---|---|---|
| **S9** | Stripe integration: checkout para unlock de leads, webhooks | Cuenta Stripe CR |
| **S10** | Chat en tiempo real (Supabase Realtime), moderación básica | Fase 2 |
| **S11** | Notificaciones: email transaccional (Resend), in-app notifications | S9-S10 |
| **S12** | Admin dashboard: métricas reales, audit log, configuración scoring | Fase 2-3 |

**Entregable de Fase:** Dealer puede pagar para desbloquear leads y chatear con buyers. Notificaciones funcionando.

### 19.5 FASE 4 — Pulido y Lanzamiento (Semanas 13-16)

**Objetivo:** Testing completo, optimización, y preparación para usuarios reales.

| Semana | Entregables | Dependencias |
|---|---|---|
| **S13** | Testing E2E (Playwright), fix de bugs, performance optimization | Fases 1-3 |
| **S14** | Security audit, penetration testing, rate limiting, headers | S13 |
| **S15** | Beta privada (10-20 usuarios reales), onboarding 2-3 dealers | S14 |
| **S16** | Bug fixes de beta, documentación, preparación lanzamiento público | S15 |

**Entregable de Fase:** Plataforma lista para lanzamiento público con usuarios reales validados.

### 19.6 Post-Lanzamiento (Meses 5-8)

| Mes | Foco |
|---|---|
| **Mes 5** | Iteración basada en feedback beta, métricas, ajuste pricing |
| **Mes 6** | Suscripciones dealer, vehículos destacados, push notifications |
| **Mes 7** | KYC automatizado (Veriff), mejoras al scoring (historial) |
| **Mes 8** | Mobile app (React Native o PWA mejorada), marketing automation |

### 19.7 Consideraciones para el Contexto Costarricense

- **Trámites legales:** Registrar empresa, inscripción tributaria digital → Paralelizar con Fase 1
- **Cuenta Stripe CR:** Activación puede tardar 1-2 semanas → Iniciar en Semana 6
- **Facturación electrónica:** Proveedor debe estar homologado por Hacienda → Investigar en Fase 2
- **Dealers piloto:** Identificar 3-5 patios friendly para beta → Networking desde Semana 1
- **Internet/infraestructura:** Costa Rica tiene buena conectividad; no es un blocker
- **Zona horaria:** UTC-6 (CST) — considerar para CRON jobs y scheduling de eventos

---

## 20. Estimaciones de Tiempo y Costo

### 20.1 Supuestos Base

| Parámetro | Valor |
|---|---|
| Frontend existente | ✅ Completado (~30% del trabajo total ahorrado) |
| Dev solo (senior full-stack) | 40 horas/semana |
| Equipo pequeño | 3-4 personas |
| Overhead (meetings, planning) | 15% del tiempo |
| Buffer para imprevistos | 20% |

### 20.2 Estimación por Componente (Dev Solo)

| Componente | Semanas | Horas | Notas |
|---|---|---|---|
| **Setup infraestructura** (Supabase, Vercel, CI/CD) | 1 | 40 | Una vez |
| **Base de datos** (esquema, migraciones, RLS, seeds) | 1.5 | 60 | Incluye políticas RLS |
| **Autenticación** (registro, login, roles, middleware) | 1.5 | 60 | Incluye OAuth |
| **API Routes** (todos los endpoints CRUD) | 3 | 120 | ~20 endpoints |
| **Lógica de eventos** (lifecycle, reglas) | 1.5 | 60 | Incluye CRON/triggers |
| **Sistema de ofertas** (validación, reglas) | 1 | 40 | |
| **Lead scoring** (migración + mejoras) | 1 | 40 | Lógica ya diseñada |
| **Modelo de privacidad** (RLS + API layer) | 1 | 40 | Crítico, testing intensivo |
| **Storage** (imágenes, documentos) | 1 | 40 | |
| **Stripe** (checkout, webhooks, testing) | 1.5 | 60 | Incluye edge cases |
| **Chat realtime** (Supabase Realtime) | 1.5 | 60 | |
| **Notificaciones** (email, in-app, push) | 1 | 40 | Templates + delivery |
| **KYC** (upload + manual review flow) | 1 | 40 | Manual en Fase 1 |
| **Integración frontend** (refactor data layer) | 2.5 | 100 | Adaptar 30+ páginas |
| **Testing** (unit + integration + E2E) | 2.5 | 100 | |
| **Security audit + hardening** | 1 | 40 | Headers, rate limit, pen test |
| **Admin dashboard** (métricas reales) | 1 | 40 | |
| **Beta testing + bug fixes** | 2 | 80 | |
| **SUBTOTAL** | 26 | 1,040 | |
| **+ Buffer 20%** | 5 | 200 | |
| **TOTAL** | **31 semanas** | **~1,240 horas** | |

### 20.3 Estimación por Equipo

| Escenario | Duración | Costo Estimado (CR) | Costo (USD) |
|---|---|---|---|
| **1 dev senior solo** | 7-8 meses | ₡9,000,000 - ₡12,000,000 total | $17,000 - $22,000 |
| **2 devs** (1 senior + 1 mid) | 4-5 meses | ₡7,000,000 - ₡10,000,000/mes × 4.5 | $25,000 - $35,000 |
| **3-4 devs** (equipo completo) | 3-4 meses | ₡10,000,000 - ₡15,000,000/mes × 3.5 | $35,000 - $50,000 |
| **Outsource (agencia CR)** | 4-5 meses | Cotizar por proyecto | $40,000 - $70,000 |

*Nota: Salarios basados en mercado costarricense. Senior: ₡2.5-3.5M/mes, Mid: ₡1.5-2.5M/mes.*

### 20.4 Costos de Infraestructura Mensual

| Servicio | Plan | Costo Mensual |
|---|---|---|
| Supabase | Pro | $25/mes |
| Vercel | Pro | $20/mes |
| Resend | Pro (50K emails) | $20/mes |
| Stripe | Pay-as-you-go | 2.9% + $0.30 por transacción |
| Sentry | Team | $26/mes |
| Domain + DNS | Anual | ~$15/año |
| UptimeRobot | Free/Pro | $0-7/mes |
| Twilio (SMS) | Pay-as-you-go | ~$10-30/mes |
| **TOTAL estimado** | | **$120-160/mes** (pre-revenue) |

### 20.5 Costos Según Escala

| Usuarios Activos | Infra/mes | Notas |
|---|---|---|
| 0-1,000 | $120-160 | Plan actual suficiente |
| 1,000-5,000 | $200-400 | Supabase Pro + add-ons |
| 5,000-20,000 | $500-1,000 | Upgrade storage, más compute |
| 20,000-50,000 | $1,000-2,500 | Considerar migración a AWS |
| 50,000+ | $3,000+ | AWS custom infra |

### 20.6 ROI Estimado

Asumiendo:
- 50 leads vendidos/mes a promedio ₡12,000 c/u = ₡600,000/mes
- 10 dealers con suscripción ₡50,000/mes = ₡500,000/mes
- **Break-even operativo** (solo infra): ~Mes 2 post-lanzamiento
- **Break-even total** (incluyendo desarrollo): 12-18 meses

---

## 21. Riesgos Técnicos

### 21.1 Matriz de Riesgos

| # | Riesgo | Probabilidad | Impacto | Mitigación |
|---|---|---|---|---|
| R1 | Supabase realtime no escala para chat de alto volumen | Media | Alto | Benchmark temprano; alternativa: Socket.io en Edge Function |
| R2 | Stripe no aprueba cuenta CR o demora excesiva | Baja | Crítico | Iniciar proceso en Semana 1; alternativa: PayPal/local provider |
| R3 | RLS policies degradan performance con datos grandes | Media | Medio | Optimizar queries, índices; monitorear query plans |
| R4 | Migración de frontend a data real introduce bugs masivos | Alta | Medio | Migrar ruta por ruta, feature flags, testing incremental |
| R5 | Único desarrollador se enferma o renuncia | Media | Crítico | Documentar todo, código limpio, considerar segundo dev |
| R6 | Dealers no adoptan la plataforma | Media | Crítico | Beta con 3-5 dealers amigos; validar propuesta de valor pre-build |
| R7 | Volumen de ofertas bajo no justifica scoring algorithm | Media | Alto | Simplificar pricing; pivotar a modelo más simple si necesario |
| R8 | Cambios regulatorios en CR afectan operación | Baja | Alto | Consulta legal temprana; diseñar con flexibilidad |
| R9 | Performance en mobile (CR = alto uso mobile) | Media | Medio | Lighthouse CI, optimización agresiva, considerar PWA |
| R10 | Data breach o vulnerabilidad de seguridad | Baja | Crítico | Security audit pre-launch, bug bounty básico, Sentry alertas |

### 21.2 Plan de Contingencia por Riesgo Crítico

**R2 — Stripe no disponible en CR:**
- Plan B: Implementar con proveedor local (BAC Credomatic gateway)
- Plan C: PayPal Commerce Platform (soporta CRC)
- Impacto en timeline: +2 semanas de integración alternativa

**R5 — Bus factor = 1:**
- Documentación exhaustiva desde Día 1
- Code reviews (self-review con checklist)
- Arquitectura simple (Supabase reduce complejidad)
- Considerar contratar dev mid-level como respaldo (Semana 5+)

**R6 — Baja adopción de dealers:**
- Ofrecer período gratuito de 3 meses
- Onboarding personalizado (ir al patio, demo en persona)
- Reducir fricción: importar inventario desde WhatsApp/fotos
- Medir intención de pago antes de construir features avanzadas

### 21.3 Technical Debt Conocida

| Deuda | Origen | Impacto | Plan de Pago |
|---|---|---|---|
| Frontend sin tests | MVP de prototipo | Regressions | Agregar tests en Fase 4 |
| No hay error boundaries | MVP rápido | UX en errores | Implementar Fase 1 |
| Image Provider hardcoded a Unsplash | MVP visual | Migración necesaria | Fase 2 (storage real) |
| No hay loading states reales | Skeleton simulado | UX inconsistente | Fase 1 (Suspense + loading.tsx) |
| LocalStorage como "auth" | MVP sin backend | Seguridad nula | Fase 1 (auth real) |
| Sin internacionalización | MVP español only | Limitación futura | Post-launch si necesario |

---

## 22. Métricas y Monitoreo

### 22.1 KPIs de Negocio (Dashboard Admin)

| Métrica | Descripción | Objetivo Mes 1 | Objetivo Mes 6 |
|---|---|---|---|
| Dealers activos | Dealers con aprobación y ≥1 vehículo | 5 | 25 |
| Vehículos publicados | Total de vehículos activos | 30 | 200 |
| Buyers registrados | Usuarios con rol buyer | 100 | 2,000 |
| Ofertas por evento | Promedio de ofertas | 15 | 80 |
| Leads generados/mes | Total de leads | 20 | 150 |
| Leads unlocked/mes | Leads pagados | 10 | 75 |
| Tasa de conversión lead→contacto | % que resulta en chat | 60% | 70% |
| Revenue mensual | Ingresos totales | ₡200K | ₡2M |
| Churn rate dealers | % que cancela suscripción | <10% | <5% |

### 22.2 KPIs Técnicos (Monitoreo)

| Métrica | Herramienta | Alerta Si |
|---|---|---|
| Uptime | UptimeRobot | < 99.5% |
| Response time (P95) | Vercel Analytics | > 2 segundos |
| Error rate | Sentry | > 1% de requests |
| Core Web Vitals (LCP) | Vercel Speed Insights | > 2.5s |
| Core Web Vitals (CLS) | Vercel Speed Insights | > 0.1 |
| Database connections | Supabase Dashboard | > 80% capacity |
| Storage usage | Supabase Dashboard | > 80% del plan |
| Failed payments | Stripe Dashboard | > 5% de intentos |
| Auth failures | Supabase Logs | Spike inusual |

### 22.3 Stack de Observabilidad

```
┌──────────────────────────────────────────────┐
│              OBSERVABILIDAD                    │
│                                               │
│  ┌─────────┐  ┌─────────┐  ┌─────────────┐ │
│  │ Sentry  │  │ Vercel  │  │ Supabase    │ │
│  │ Errors  │  │Analytics│  │ Dashboard   │ │
│  │+ Traces │  │+ Vitals │  │ + Logs      │ │
│  └────┬────┘  └────┬────┘  └──────┬──────┘ │
│       │             │              │         │
│       └─────────────┼──────────────┘         │
│                     ▼                         │
│            ┌──────────────┐                   │
│            │ Alertas      │                   │
│            │ (Slack/Email)│                   │
│            └──────────────┘                   │
└──────────────────────────────────────────────┘
```

### 22.4 Logging Strategy

| Nivel | Qué se loggea | Retención |
|---|---|---|
| ERROR | Excepciones no manejadas, pagos fallidos | 90 días |
| WARN | Rate limits alcanzados, auth failures | 30 días |
| INFO | Acciones de negocio (oferta creada, lead unlocked) | 30 días |
| DEBUG | Solo en development | No en prod |
| AUDIT | Acciones admin, acceso a datos sensibles | 1 año |

---

## 23. Consideraciones Legales y Compliance (Costa Rica)

### 23.1 Marco Regulatorio Aplicable

| Regulación | Aplicabilidad | Impacto en Fair Value |
|---|---|---|
| **Ley 8968** — Protección de Datos Personales | ✅ Directa | Consentimiento, derechos ARCO, registro ante PRODHAB |
| **Ley 9416** — Impuesto al Valor Agregado (IVA) | ✅ Directa | 13% IVA sobre servicios digitales |
| **Resolución DGT-R-012-2018** — Factura Electrónica | ✅ Directa | Obligatorio emitir factura electrónica |
| **Ley 8642** — Telecomunicaciones | 🟡 Parcial | Uso de SMS para verificación |
| **Ley 7472** — Promoción de Competencia y Defensa del Consumidor | 🟡 Parcial | Transparencia en precios, publicidad |
| **Código de Comercio** | 🟡 Parcial | Intermediación comercial |
| **GDPR (EU)** | ❌ No aplica (por ahora) | Solo si se expande a mercado europeo |

### 23.2 Protección de Datos (Ley 8968 + PRODHAB)

**Obligaciones:**

1. **Registro de base de datos** ante PRODHAB (Agencia de Protección de Datos)
2. **Consentimiento informado** al recolectar datos personales
3. **Derechos ARCO:** Acceso, Rectificación, Cancelación, Oposición
4. **Política de privacidad** pública y accesible
5. **Medidas de seguridad** proporcionales al tipo de datos
6. **Notificación de brechas** en caso de filtración

**Implementación Técnica:**

| Requerimiento | Implementación |
|---|---|
| Consentimiento | Checkbox obligatorio en registro + Terms of Service |
| Derecho de acceso | Endpoint `/api/user/my-data` (export JSON) |
| Derecho de eliminación | Endpoint `/api/user/delete-account` (soft delete + purge en 30 días) |
| Minimización de datos | Solo recolectar lo necesario; purgar datos antiguos |
| Registro PRODHAB | Trámite administrativo (formulario + ₡25,000 anual) |

### 23.3 Facturación Electrónica

**Requisitos:**
- Emisor registrado ante Ministerio de Hacienda
- Certificado de firma digital (persona jurídica)
- Integración con proveedor homologado
- XML firmado digitalmente para cada transacción

**Proveedores Recomendados:**

| Proveedor | Costo/mes | API | Notas |
|---|---|---|---|
| **Gosocket / Facture** | ₡15,000-30,000 | REST | Popular en CR |
| **Comprobantes Electrónicos CR** | ₡10,000-20,000 | REST | Económico |
| **TicoFactura** | ₡8,000-15,000 | REST | Startup-friendly |

### 23.4 Estructura Societaria Recomendada

- **Tipo:** Sociedad de Responsabilidad Limitada (SRL) o Sociedad Anónima (SA)
- **Registro:** Registro Nacional + CCSS + INS
- **Tributación:** Régimen simplificado o tradicional según ingresos
- **Actividad económica:** "Servicios de intermediación comercial por medios electrónicos"

### 23.5 Términos y Condiciones (Elementos Clave)

1. Fair Value actúa como **intermediario**, no como vendedor
2. No se procesan pagos de compraventa de vehículos
3. Fair Value no garantiza el estado del vehículo ni la solvencia del comprador
4. Política de reembolso para leads que no responden (SLA: 48h)
5. Prohibición de contacto directo durante eventos activos
6. Aceptación de uso de datos para scoring y matching
7. Derecho de Fair Value a suspender cuentas por violación de ToS

### 23.6 Checklist Legal Pre-Lanzamiento

- [ ] Constitución de sociedad (SRL)
- [ ] Inscripción tributaria (ATV - Administración Tributaria Virtual)
- [ ] Registro ante PRODHAB
- [ ] Obtener firma digital (persona jurídica)
- [ ] Contratar proveedor de factura electrónica
- [ ] Redactar Términos y Condiciones (con abogado)
- [ ] Redactar Política de Privacidad
- [ ] Consulta sobre clasificación de actividad económica
- [ ] Registro de marca "Fair Value" ante Registro de Propiedad Industrial

---

## 24. Escalabilidad y Crecimiento

### 24.1 Fases de Escala

| Fase | Usuarios | Vehículos | Eventos/mes | Infra |
|---|---|---|---|---|
| **Lanzamiento** | 100-500 | 50-100 | 2-4 | Supabase Pro |
| **Crecimiento** | 500-5,000 | 100-500 | 4-8 | Supabase Pro + add-ons |
| **Escala** | 5,000-20,000 | 500-2,000 | 8-15 | Supabase Enterprise o migración AWS |
| **Enterprise** | 20,000+ | 2,000+ | 15+ | AWS custom |

### 24.2 Bottlenecks Anticipados

| Bottleneck | Cuándo | Solución |
|---|---|---|
| Conexiones DB simultáneas | >200 concurrent users | Connection pooling (PgBouncer en Supabase) |
| Storage de imágenes | >10,000 vehículos | CDN caching agresivo, image optimization |
| Realtime connections | >500 concurrent | Upgrade plan o sharding de canales |
| Scoring computation | >1,000 ofertas/evento | Background jobs (Edge Functions async) |
| Search performance | >5,000 vehículos | Migrar a Elasticsearch o Typesense |
| Email delivery | >10,000 emails/día | Queue system, throttling |

### 24.3 Estrategias de Escalado

**Horizontal (más instancias):**
- Vercel auto-escala (serverless, no requiere acción)
- Supabase read replicas (Plan Enterprise)
- CDN para assets estáticos (Vercel Edge Network)

**Vertical (más poder):**
- Upgrade Supabase compute (2 core → 4 core → 8 core)
- Upgrade storage allocation
- Dedicated database instance

**Arquitectural (rediseño):**
- Separar write/read paths (CQRS lite)
- Event sourcing para audit trail
- Microservicios para scoring (si complejidad crece)
- Search service dedicado (Typesense/Meilisearch)

### 24.4 Plan de Expansión Geográfica

| Mercado | Timeline | Consideraciones |
|---|---|---|
| **Costa Rica** (GAM) | Lanzamiento | Foco inicial: San José, Heredia, Alajuela, Cartago |
| **Costa Rica** (nacional) | Mes 4-6 | Incluir zonas costeras y rurales |
| **Panamá** | Año 2 | Mercado similar, regulación diferente |
| **Guatemala** | Año 2-3 | Mayor mercado CA, más complejidad |
| **Región Centroamérica** | Año 3+ | Requiere multi-tenancy y localización |

### 24.5 Feature Scaling (Post-MVP)

| Feature | Descripción | Impacto Esperado |
|---|---|---|
| **App Mobile (PWA/RN)** | Experiencia nativa para buyers | +40% engagement |
| **AI Recommendations** | Sugerir vehículos basado en comportamiento | +25% ofertas |
| **Inspection Service** | Inspección mecánica pre-evento | Trust + premium pricing |
| **Financing Integration** | Pre-aprobación de crédito vehicular | +30% conversión |
| **Dealer Analytics Pro** | Insights avanzados, competitor analysis | Monetización premium |
| **Multi-language** | Inglés para expats/turistas | Mercado ampliado |
| **API Pública** | Dealers publican desde su sistema | Reducir fricción |

### 24.6 Métricas de Decisión para Migrar a AWS

Migrar cuando se cumplan **2 o más** de estos criterios:
- Más de 50,000 usuarios activos mensuales
- Más de 500 conexiones Realtime simultáneas constantes
- Necesidad de compliance específico (SOC2, ISO27001)
- Revenue > $50K/mes (justifica costo de infraestructura dedicada)
- Requisito de presencia en múltiples regiones geográficas

---

## 25. Recomendaciones Finales y Próximos Pasos

### 25.1 Resumen de Recomendaciones Clave

| # | Recomendación | Razón |
|---|---|---|
| 1 | **Usar Supabase + Vercel** como stack principal | Velocidad al mercado, costo bajo, complejidad reducida |
| 2 | **No reescribir el frontend** — integrarlo incrementalmente | El 30% del trabajo ya está hecho y funciona bien |
| 3 | **Priorizar el flujo core** (evento → ofertas → leads → unlock) | Es la propuesta de valor; todo lo demás es secundario |
| 4 | **Validar con dealers REALES antes de completar todo** | Reducir riesgo de construir algo que nadie usa |
| 5 | **Empezar con KYC manual** | Automatizar después cuando el proceso esté validado |
| 6 | **Contratar al menos 1 dev adicional en Fase 2** | Bus factor, velocidad, code review |
| 7 | **Consultar abogado para ToS y compliance** | Regulación CR es específica; no improvisar |
| 8 | **Iniciar trámites legales en paralelo** (sociedad, PRODHAB, Hacienda) | Pueden tardar 4-8 semanas |
| 9 | **Diseñar para migración** (no vendor lock-in extremo) | PostgreSQL estándar facilita mover a cualquier cloud |
| 10 | **Medir todo desde el Día 1** | Sin métricas no hay decisiones informadas |

### 25.2 Decisiones que Se Deben Tomar YA

| Decisión | Opciones | Recomendación |
|---|---|---|
| ¿Equipo o solo dev? | Solo senior vs. 2-3 personas | Mínimo 2 personas para Fase 2+ |
| ¿Nombre de dominio? | fairvalue.cr, fairvalue.co.cr, etc. | Registrar ambos (.cr y .com) |
| ¿Moneda de la plataforma? | Solo CRC vs. dual CRC/USD | Solo CRC para V1 (mercado local) |
| ¿Tipo de sociedad? | SRL vs. SA | SRL (más simple, suficiente para inicio) |
| ¿Pricing de leads? | Fixed vs. variable vs. auction | Fixed por nivel (Priority/Hot/Warm/Cold) para V1 |
| ¿Beta cerrada o abierta?| Invitación vs. registro público | Cerrada con 10-20 buyers + 3-5 dealers |

### 25.3 Próximos Pasos Inmediatos (Próximas 2 Semanas)

```
Semana 0 (Ahora):
├── ✅ Revisar y aprobar este documento técnico
├── 📋 Definir prioridades de negocio (¿qué features son V1?)
├── 💼 Iniciar trámites legales (sociedad, marca)
├── 🔑 Crear cuenta Supabase (free tier para desarrollo)
├── 🔑 Crear cuenta Vercel (conectar repo GitHub)
└── 🤝 Identificar 3 dealers piloto para beta

Semana 1:
├── 🗄️ Implementar esquema de base de datos en Supabase
├── 🔐 Configurar Supabase Auth (email + Google OAuth)
├── 🏗️ Crear primeras API Routes (auth, profiles, vehicles)
├── ⚡ Setup CI/CD pipeline (GitHub Actions + Vercel)
└── 📧 Crear cuenta Resend (email)

Semana 2:
├── 🔗 Comenzar integración frontend ↔ backend (auth primero)
├── 🗄️ Implementar RLS policies básicas
├── 🧪 Escribir primeros tests (scoring, auth)
├── 💳 Iniciar registro de cuenta Stripe CR
└── 📝 Documentar API (OpenAPI/Swagger)
```

### 25.4 Criterios de Éxito por Fase

| Fase | Criterio de Éxito | Métrica |
|---|---|---|
| **Fase 1** | Auth funciona, CRUD básico end-to-end | 0 bugs bloqueantes |
| **Fase 2** | Flujo completo de evento ejecutable | 1 evento de prueba exitoso |
| **Fase 3** | Pago de lead funciona en sandbox | Stripe checkout completo |
| **Fase 4** | Beta con usuarios reales sin crashes | 99% uptime, NPS > 7 |
| **Lanzamiento** | 5 dealers activos, 50 ofertas reales | Revenue > $0 |

### 25.5 Lo Que NO Hacer

| Anti-patrón | Por Qué Evitarlo |
|---|---|
| ❌ Reescribir el frontend desde cero | Es funcional, responsive, y premium. Integrarlo, no rehacerlo |
| ❌ Construir features que nadie pidió | Validar con dealers antes de invertir tiempo |
| ❌ Optimizar prematuramente | No necesitas microservicios con 100 usuarios |
| ❌ Ignorar mobile | Costa Rica es mobile-first; testear constantemente |
| ❌ Lanzar sin términos legales | Riesgo legal innecesario |
| ❌ Hardcodear precios/reglas de negocio | Todo configurable por admin desde Día 1 |
| ❌ Saltarse testing en flujos de pago | Un bug de pago destruye confianza |
| ❌ Agregar AI/ML antes de tener datos | Se necesitan mínimo 6 meses de datos reales |

### 25.6 Visión a 12 Meses

```
Hoy                    Mes 4              Mes 8              Mes 12
┌──────────┐          ┌──────────┐       ┌──────────┐      ┌──────────┐
│ Prototipo│          │ MVP Live │       │ Product  │      │ Growth   │
│ Frontend │──────────│ Beta     │───────│ Market   │──────│ Stage    │
│ Only     │          │ Cerrada  │       │ Fit      │      │          │
└──────────┘          └──────────┘       └──────────┘      └──────────┘

Métricas:              5 dealers          25 dealers         50+ dealers
                       100 buyers          2,000 buyers       10,000+ buyers
                       $0 revenue          ₡1M/mes            ₡5M+/mes
                       
Foco:                  Técnico            Producto           Crecimiento
                       (construir)        (iterar)           (escalar)
```

---

## Conclusión

Fair Value cuenta con una base sólida: un frontend premium completamente navegable que representa el 30% del trabajo total. El camino a producción requiere aproximadamente 16 semanas de desarrollo enfocado (con equipo de 3-4 personas) para tener una plataforma funcional con usuarios reales.

La arquitectura recomendada (Supabase + Vercel + Next.js API Routes) permite llegar al mercado rápido sin sacrificar calidad ni seguridad. La naturaleza del negocio (intermediación por eventos periódicos) es ideal para un startup de 2-3 personas que puede iterar basándose en feedback real de dealers costarricenses.

**El siguiente paso más importante:** Validar con 3-5 dealers reales que el modelo de leads pagados tiene demanda, y en paralelo, iniciar la implementación de Fase 1.

---

*Documento preparado como guía técnica completa. Sujeto a revisión y actualización conforme avance el proyecto.*

*Fair Value © 2025 — Todos los derechos reservados*
