import { expect, test } from '@playwright/test';
import { CANONICAL_USER } from './global-setup';
import { createTestUser } from './fixtures';

test.describe('login', () => {
	test('verified user with correct credentials reaches the home page', async ({ page }) => {
		await page.goto('/login');

		await page.getByLabel('Email').fill(CANONICAL_USER.email);
		await page.getByLabel('Password').fill(CANONICAL_USER.password);
		await page.getByRole('button', { name: 'Continue' }).click();

		await expect(page).toHaveURL('/');

		// Verify the session survives a reload — cookie was actually set.
		await page.reload();
		await expect(page).toHaveURL('/');
	});

	test('wrong password shows an error and stays on /login', async ({ page }) => {
		await page.goto('/login');

		await page.getByLabel('Email').fill(CANONICAL_USER.email);
		await page.getByLabel('Password').fill('WrongPassword123');
		await page.getByRole('button', { name: 'Continue' }).click();

		await expect(page.getByText(/invalid email or password/i)).toBeVisible();
		await expect(page).toHaveURL(/\/login$/);
	});

	test('unverified user sees "verify your email" message', async ({ page }) => {
		const unverified = await createTestUser({ verified: false });

		await page.goto('/login');
		await page.getByLabel('Email').fill(unverified.email);
		await page.getByLabel('Password').fill(unverified.password);
		await page.getByRole('button', { name: 'Continue' }).click();

		await expect(page.getByText(/you must verify your email/i)).toBeVisible();
		await expect(page).toHaveURL(/\/login$/);
	});

	test('input without @ shows "invalid email"', async ({ page }) => {
		await page.goto('/login');

		await page.getByLabel('Email').fill('not-an-email');
		await page.getByLabel('Password').fill('TestPassword123');
		await page.getByRole('button', { name: 'Continue' }).click();

		await expect(page.getByText(/invalid email/i)).toBeVisible();
	});

	test('password shorter than 6 chars shows "invalid password"', async ({ page }) => {
		await page.goto('/login');

		// The password field has minlength={6}. Strip it and set value via evaluate
		// to reach the server-side branch we're testing.
		await page.getByLabel('Email').fill(CANONICAL_USER.email);
		await page.evaluate(() => {
			const input = document.querySelector<HTMLInputElement>('input[name="password"]');
			if (input) {
				input.removeAttribute('minlength');
				input.value = 'abc';
				input.dispatchEvent(new Event('input', { bubbles: true }));
			}
		});
		await page.getByRole('button', { name: 'Continue' }).click();

		await expect(page.getByText(/invalid password/i)).toBeVisible();
	});
});
