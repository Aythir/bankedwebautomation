import {Page, test} from '@playwright/test';

async function setupPayment(page: Page, accountNumber: string, bankStateBranchNumber: string = '111114') {
    // Create hosted checkout instance for a new customer.
    await page.goto('/new');
    await page.getByLabel('New customer').check();
    await page.getByTestId('region-selector').selectOption('AU');
    await page.getByTestId('create-hosted-checkout').click();
    await page.getByRole('button', {name: 'Mock Bank'}).click();

    // Enter account details on checkout.
    await page.getByTestId('ACCOUNT_NAME').fill('test account');
    await page.getByTestId('BSB_NUMBER').fill(bankStateBranchNumber);
    await page.getByTestId('ACCOUNT_NUMBER').fill(accountNumber);
    await page.getByTestId('supplemental-attr-form-submit').click();

}

const accounts = [
    {accountNumber: '12345678', description: 'valid account number'},
    {accountNumber: '050511', description: 'valid account number with payment delay of 11 seconds'}
];

test.describe('Hosted Checkout: Mock Bank AU', () => {
    accounts.forEach(({accountNumber, description}) =>
        test(`should successfully complete payment with account number ${accountNumber} as a ${description}`, async ({page}, testInfo) => {
            // Arrange & Act.
            await setupPayment(page, accountNumber);

            // Assert.
            const paymentCompleteLocator = page.getByText('Payment complete');
            const screenshot = await paymentCompleteLocator.screenshot({timeout: accountNumber === '050511' ? 15000 : undefined});
            await testInfo.attach('Payment Complete screenshot', {body: screenshot, contentType: 'image/png'});
        }));

    // Additional test for handling payment failure
    test('should correctly handle failure in creating a payment agreement', async ({page}, testInfo) => {
        // Arrange.
        const paymentFailureAccountNumber = '010112';

        // Act.
        await setupPayment(page, paymentFailureAccountNumber);

        // Assert.
        const paymentFailedLocator = page.getByText('Payment Failed');
        const screenshot = await paymentFailedLocator.screenshot();
        await testInfo.attach('Payment Failure screenshot', {body: screenshot, contentType: 'image/png'});
    });

    test('should correctly handle insufficient funds in customer account', async ({page}, testInfo) => {
        // Arrange.
        const accountNumber = '010124';

        // Act.
        await setupPayment(page, accountNumber);

        // Assert.
        const paymentFailedLocator = page.getByText('Insufficient funds');
        const screenshot = await paymentFailedLocator.screenshot();
        await testInfo.attach('Insufficient funds screenshot', {body: screenshot, contentType: 'image/png'});
    });
});
