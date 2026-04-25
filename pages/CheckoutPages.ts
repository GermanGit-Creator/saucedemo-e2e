import { type Page, type Locator, expect } from '@playwright/test';

// ── Step One: Customer Information ──────────────────────────────────────────
export class CheckoutStepOnePage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly zipCodeInput: Locator;
  readonly continueButton: Locator;
  readonly pageTitle: Locator;

  constructor(page: Page) {
    this.page           = page;
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput  = page.locator('[data-test="lastName"]');
    this.zipCodeInput   = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.pageTitle      = page.locator('.title');
  }

  async assertOnStepOne() {
    await expect(this.page).toHaveURL('/checkout-step-one.html');
    await expect(this.pageTitle).toHaveText('Checkout: Your Information');
  }

  async fillCustomerInfo(firstName: string, lastName: string, zip: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.zipCodeInput.fill(zip);
    await this.continueButton.click();
  }
}

// ── Step Two: Order Summary ──────────────────────────────────────────────────
export class CheckoutStepTwoPage {
  readonly page: Page;
  readonly summaryItems: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;
  readonly pageTitle: Locator;

  constructor(page: Page) {
    this.page          = page;
    this.summaryItems  = page.locator('.cart_item');
    this.subtotalLabel = page.locator('.summary_subtotal_label');
    this.taxLabel      = page.locator('.summary_tax_label');
    this.totalLabel    = page.locator('.summary_total_label');
    this.finishButton  = page.locator('[data-test="finish"]');
    this.pageTitle     = page.locator('.title');
  }

  async assertOnStepTwo() {
    await expect(this.page).toHaveURL('/checkout-step-two.html');
    await expect(this.pageTitle).toHaveText('Checkout: Overview');
  }

  async assertSubtotalVisible() {
    await expect(this.subtotalLabel).toBeVisible();
    await expect(this.taxLabel).toBeVisible();
    await expect(this.totalLabel).toBeVisible();
  }

  async assertItemInSummary(productName: string) {
    const item = this.page.locator('.cart_item_label', { hasText: productName });
    await expect(item).toBeVisible();
  }

  async assertTotalEqualsSubtotalPlusTax() {
    const subtotalText = await this.subtotalLabel.innerText();
    const taxText      = await this.taxLabel.innerText();
    const totalText    = await this.totalLabel.innerText();

    const parse = (s: string) => parseFloat(s.replace(/[^0-9.]/g, ''));
    const subtotal = parse(subtotalText);
    const tax      = parse(taxText);
    const total    = parse(totalText);

    const expected = parseFloat((subtotal + tax).toFixed(2));
    expect(total).toBeCloseTo(expected, 2);
  }

  async finishOrder() {
    await this.finishButton.click();
  }
}
