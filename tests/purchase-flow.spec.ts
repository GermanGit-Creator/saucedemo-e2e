import { test, expect } from '@playwright/test';
import { qase }                                       from 'playwright-qase-reporter';
import { LoginPage }                                   from '../pages/LoginPage';
import { InventoryPage }                               from '../pages/InventoryPage';
import { CartPage }                                    from '../pages/CartPage';
import { CheckoutStepOnePage, CheckoutStepTwoPage }   from '../pages/CheckoutPages';
import { ConfirmationPage }                            from '../pages/ConfirmationPage';

// ── Test data ────────────────────────────────────────────────────────────────
const CREDENTIALS = {
  valid:  { username: 'standard_user',  password: 'secret_sauce' },
  locked: { username: 'locked_out_user', password: 'secret_sauce' },
};

const CUSTOMER = { firstName: 'John', lastName: 'Doe', zip: '12345' };
const PRODUCT  = 'Sauce Labs Backpack';

// ── SD-3 | Flujo completo de compra en Sauce Demo ────────────────────────────
test.describe('SD-3 | Flujo completo de compra', () => {

  test(qase(3, 'TC-01 | Login → agregar producto → checkout → confirmación'), async ({ page }) => {
    const loginPage      = new LoginPage(page);
    const inventoryPage  = new InventoryPage(page);
    const cartPage       = new CartPage(page);
    const stepOnePage    = new CheckoutStepOnePage(page);
    const stepTwoPage    = new CheckoutStepTwoPage(page);
    const confirmPage    = new ConfirmationPage(page);

    // ── Step 1: Navegar al sitio ─────────────────────────────────────────────
    await loginPage.goto();
    await loginPage.assertOnLoginPage();

    // ── Step 2: Iniciar sesión ───────────────────────────────────────────────
    await loginPage.login(CREDENTIALS.valid.username, CREDENTIALS.valid.password);
    await inventoryPage.assertOnInventoryPage();

    // ── Step 3: Agregar producto al carrito ──────────────────────────────────
    await inventoryPage.addProductToCart(PRODUCT);
    await inventoryPage.assertCartCount(1);

    // ── Step 4: Ir al carrito ────────────────────────────────────────────────
    await inventoryPage.goToCart();
    await cartPage.assertOnCartPage();
    await cartPage.assertProductInCart(PRODUCT);
    await cartPage.assertCartItemCount(1);

    // ── Step 5: Iniciar checkout ─────────────────────────────────────────────
    await cartPage.proceedToCheckout();
    await stepOnePage.assertOnStepOne();

    // ── Step 6: Ingresar información del comprador ───────────────────────────
    await stepOnePage.fillCustomerInfo(
      CUSTOMER.firstName,
      CUSTOMER.lastName,
      CUSTOMER.zip
    );
    await stepTwoPage.assertOnStepTwo();
    await stepTwoPage.assertItemInSummary(PRODUCT);
    await stepTwoPage.assertSubtotalVisible();
    await stepTwoPage.assertTotalEqualsSubtotalPlusTax();

    // ── Step 7: Confirmar orden ──────────────────────────────────────────────
    await stepTwoPage.finishOrder();
    await confirmPage.assertOnConfirmationPage();
    await confirmPage.assertOrderConfirmed();

    // ── Step 8: Regresar al catálogo ─────────────────────────────────────────
    await confirmPage.goBackHome();
    await inventoryPage.assertOnInventoryPage();
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
  });

});

// ── Casos negativos ──────────────────────────────────────────────────────────
test.describe('Casos negativos – Login', () => {

  test(qase(4, 'TC-02 | Login con usuario bloqueado muestra error'), async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(CREDENTIALS.locked.username, CREDENTIALS.locked.password);
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('locked out');
  });

  test(qase(5, 'TC-03 | Login con credenciales vacías muestra error'), async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('', '');
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Username is required');
  });

  test(qase(6, 'TC-04 | Login con contraseña incorrecta muestra error'), async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(CREDENTIALS.valid.username, 'wrong_password');
    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.errorMessage).toContainText('Username and password do not match');
  });

});
