import { test, expect } from '@playwright/test'
import ownersObj from '../test-data/owners.json'

test.beforeEach(async ({ page }) => {
    await page.route("**/api/owners", async route => {
        await route.fulfill({
            contentType: "application/json",
            body: JSON.stringify(ownersObj)
        })

    })

    await page.goto('/')
    await page.getByRole('button', { name: "Owners" }).click()
    await page.getByRole('link', { name: "Search" }).click()

})

test('Mocking API Response', async ({ page }) => {
    await expect(page.getByRole("heading")).toHaveText("Owners")

})