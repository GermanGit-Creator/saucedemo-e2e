# Sauce Demo – Pruebas E2E con Playwright

Este proyecto contiene las pruebas E2E que desarrollé para el flujo de compra de [Sauce Demo](https://www.saucedemo.com), documentadas en QASE bajo el caso **SD-3**. Usé Playwright con TypeScript y apliqué el patrón Page Object Model para mantener el código organizado y fácil de escalar.

## Estructura del proyecto

```
saucedemo-e2e/
├── pages/                      # Page Object Model
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   ├── CheckoutPages.ts        # StepOne + StepTwo
│   └── ConfirmationPage.ts
├── tests/
│   └── purchase-flow.spec.ts   # 4 casos de prueba
├── playwright.config.ts
├── .env.example                # variables de entorno requeridas
├── package.json
└── README.md
```

## Casos de prueba

Cubrí tanto el flujo principal como los escenarios de error más comunes en el login:

| ID QASE | ID Local | Descripción                                     | Tipo     |
|---------|----------|-------------------------------------------------|----------|
| SD-3    | TC-01    | Flujo completo: login → carrito → checkout → OK | Positivo |
| SD-4    | TC-02    | Login con usuario bloqueado                     | Negativo |
| SD-5    | TC-03    | Login con campos vacíos                         | Negativo |
| SD-6    | TC-04    | Login con contraseña incorrecta                 | Negativo |

## Instalación

```bash
# 1. Instalar dependencias (incluye playwright-qase-reporter)
npm install

# 2. Instalar browser
npm run install:browsers

# 3. Configurar variables de entorno
cp .env.example .env
# Edita .env y agrega tu API token de QASE
```

## Obtener el API Token de QASE

1. Ir a **Apps** en tu workspace de QASE → buscar **Playwright Reporter** → activar
2. En la pestaña **Access tokens** → crear un nuevo token
3. Copiar el token y pegarlo en tu archivo `.env`

## Ejecución

```bash
# Sin enviar resultados a QASE (modo local)
npm test
npm run test:headed    # con navegador visible
npm run test:ui        # modo UI interactivo
npm run test:debug     # paso a paso

# Enviando resultados a QASE (modo testops)
npm run test:qase

# Ver reporte HTML local
npm run report
```

## Datos de prueba

| Campo    | Valor               |
|----------|---------------------|
| Usuario  | standard_user       |
| Password | secret_sauce        |
| Producto | Sauce Labs Backpack |
| Nombre   | John Doe            |
| ZIP      | 12345               |

## Integración con QASE

Cada test está vinculado a su caso en QASE usando la función `qase(id, title)` del reporter:

```typescript
test(qase(3, 'TC-01 | Login → agregar producto → checkout → confirmación'), async ({ page }) => {
  // ...
});
```

Al correr con `npm run test:qase`, el reporter crea automáticamente un **Test Run** en QASE y publica el resultado (PASSED / FAILED) en el caso correspondiente. El run se cierra solo al terminar la ejecución.

## Configuración

Configuré `playwright.config.ts` para que los screenshots y videos solo se guarden cuando un test falla, y el trace se active en el primer reintento. Así no se acumula basura en ejecuciones exitosas.

- **Browser:** Chromium (Desktop Chrome)
- **Base URL:** https://www.saucedemo.com
- **Retries:** 1 en caso de fallo
- **Screenshot:** solo en fallo
- **Video:** se conserva en fallo
- **Trace:** en primer reintento

## Por qué usé Page Object Model

Decidí separar cada pantalla en su propia clase para que si Sauce Demo cambia algún selector, solo tenga que actualizar un archivo y no buscar por todo el proyecto. Cada clase tiene locators declarados como propiedades usando atributos `data-test`, que son más estables que los selectores CSS genéricos, y métodos separados para acciones y aserciones.

El resultado es que el test principal se lee casi como los pasos que documenté en QASE, lo cual facilita el mantenimiento.

## Estructura del proyecto

```
saucedemo-e2e/
├── pages/                      # Page Object Model
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── CartPage.ts
│   ├── CheckoutPages.ts        # StepOne + StepTwo
│   └── ConfirmationPage.ts
├── tests/
│   └── purchase-flow.spec.ts   # 4 casos de prueba
├── playwright.config.ts
├── package.json
└── README.md
```

## Casos de prueba

Cubrí tanto el flujo principal como los escenarios de error más comunes en el login:

| ID   | Descripción                                      | Tipo     |
|------|--------------------------------------------------|----------|
| TC-01| Flujo completo: login → carrito → checkout → OK  | Positivo |
| TC-02| Login con usuario bloqueado                      | Negativo |
| TC-03| Login con campos vacíos                          | Negativo |
| TC-04| Login con contraseña incorrecta                  | Negativo |

## Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Instalar browser
npm run install:browsers
```

## Ejecución

```bash
# Correr todos los tests (headless)
npm test

# Ver el navegador mientras corre
npm run test:headed

# Modo UI interactivo (recomendado para desarrollo)
npm run test:ui

# Modo debug paso a paso
npm run test:debug

# Ver reporte HTML después de correr tests
npm run report
```

## Datos de prueba

| Campo    | Valor               |
|----------|---------------------|
| Usuario  | standard_user       |
| Password | secret_sauce        |
| Producto | Sauce Labs Backpack |
| Nombre   | John Doe            |
| ZIP      | 12345               |

## Configuración

Configuré `playwright.config.ts` para que los screenshots y videos solo se guarden cuando un test falla, y el trace se active en el primer reintento. Así no se acumula basura en ejecuciones exitosas.

- **Browser:** Chromium (Desktop Chrome)
- **Base URL:** https://www.saucedemo.com
- **Retries:** 1 en caso de fallo
- **Screenshot:** solo en fallo
- **Video:** se conserva en fallo
- **Trace:** en primer reintento

## Por qué usé Page Object Model

Decidí separar cada pantalla en su propia clase para que si Sauce Demo cambia algún selector, solo tenga que actualizar un archivo y no buscar por todo el proyecto. Cada clase tiene locators declarados como propiedades usando atributos `data-test`, que son más estables que los selectores CSS genéricos, y métodos separados para acciones y aserciones.

El resultado es que el test principal se lee casi como los pasos que documenté en QASE, lo cual facilita el mantenimiento.
