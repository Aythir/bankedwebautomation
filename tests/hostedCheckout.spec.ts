import { test, expect } from '@playwright/test';

const bankStateBranch = 111114;
test.beforeEach(async ({ page }) => {
  await page.goto('/');

});

test.describe('Hosted Checkout: Mock Bank AU', () => {
  test('when given valid account number and bsb, should successfully process payment', async ({ page }) => {
    // Arrange.
    const accountNumber = '12345678';

    // Act.


    // Assert.
  });
});
