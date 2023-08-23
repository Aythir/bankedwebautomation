import { test } from '@playwright/test';

const bankStateBranch = '111114';
test.beforeEach(async ({ page }) => {
    await page.goto('/new');
    await page.getByLabel('New customer').check();
    await page.getByTestId('region-selector').selectOption('AU');
    await page.getByTestId('create-hosted-checkout').click();
    await page.getByRole('button', { name: 'Mock Bank' }).click();
});

test.describe('Hosted Checkout: Mock Bank AU', () => {
    test('when given valid account number and bsb, should successfully process payment', async ({ page }, testInfo) => {
        // Arrange.
        const accountNumber = '12345678';

        // Act.
        await page.getByTestId('ACCOUNT_NAME').fill('test account');
        await page.getByTestId('BSB_NUMBER').fill(bankStateBranch);
        await page.getByTestId('ACCOUNT_NUMBER').fill(accountNumber);
        await page.getByTestId('supplemental-attr-form-submit').click();
        await page.waitForLoadState('networkidle');

        // Assert.
        let paymentCompleteLocator =  page.getByText('Payment complete');
        const screenshot = await paymentCompleteLocator.screenshot();
        await testInfo.attach('Payment Complete screenshot', { body: screenshot, contentType: 'image/png'})

    });
});