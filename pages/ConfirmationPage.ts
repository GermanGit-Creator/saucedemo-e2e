import { type Page, type Locator, expect } from '@playwright/test';

export class ConfirmationPage {
  readonly page: Page;
  readonly confirmationHeader: Locator;
  readonly confirmationText: Locator;
  readonly backHomeButton: Locator;
  readonly ponyExpress: Locator;

  constructor(page: Page) {
    this.page               = page;
    this.confirmationHeader = page.locator('.complete-header');
    this.confirmationText   = page.locator('.complete-text');
    this.backHomeButton     = page.locator('[data-test="back-to-products"]');
    this.ponyExpress        = page.locator('.pony_express');
  }

  async assertOnConfirmationPage() {
    await expect(this.page).toHaveURL('/checkout-complete.html');
  }

  async assertOrderConfirmed() {
    await expect(this.confirmationHeader).toHaveText('Thank you for your order!');
    await expect(this.ponyExpress).toBeVisible();
    await expect(this.backHomeButton).toBeVisible();
  }

  async goBackHome() {
    await this.backHomeButton.click();
  }
}
