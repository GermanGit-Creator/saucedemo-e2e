import { type Page, type Locator, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly pageTitle: Locator;

  constructor(page: Page) {
    this.page           = page;
    this.cartItems      = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.pageTitle      = page.locator('.title');
  }

  async assertOnCartPage() {
    await expect(this.page).toHaveURL('/cart.html');
    await expect(this.pageTitle).toHaveText('Your Cart');
  }

  async assertProductInCart(productName: string) {
    const item = this.page.locator('.cart_item_label', { hasText: productName });
    await expect(item).toBeVisible();
  }

  async assertCartItemCount(expected: number) {
    await expect(this.cartItems).toHaveCount(expected);
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }
}
