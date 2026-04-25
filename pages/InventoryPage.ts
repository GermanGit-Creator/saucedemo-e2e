import { type Page, type Locator, expect } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly cartBadge: Locator;
  readonly cartIcon: Locator;
  readonly pageTitle: Locator;

  constructor(page: Page) {
    this.page      = page;
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartIcon  = page.locator('.shopping_cart_link');
    this.pageTitle = page.locator('.title');
  }

  async assertOnInventoryPage() {
    await expect(this.page).toHaveURL('/inventory.html');
    await expect(this.pageTitle).toHaveText('Products');
  }

  async addProductToCart(productName: string) {
    // Build the data-test id from the product name
    const testId = `add-to-cart-${productName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[()]/g, '')}`;
    const addButton = this.page.locator(`[data-test="${testId}"]`);
    await addButton.click();
  }

  async assertCartCount(expected: number) {
    await expect(this.cartBadge).toHaveText(String(expected));
  }

  async goToCart() {
    await this.cartIcon.click();
  }
}
