import { test, expect } from '@playwright/test'
import ownersObj from '../test-data/ownersList.json'
import firstOwnerInfoObj from '../test-data/ownerKyaClarkInfo.json'

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

test('mocking API request', async ({ page }) => {
    await expect(page.locator("#ownersTable").locator("tbody > tr")).toHaveCount(2)
    await page.route("**/api/owners/*", async route => {
        await route.fulfill({
            contentType: "application/json",
            body: JSON.stringify(firstOwnerInfoObj)
        })

    })
    await page.getByRole("link", { name: "Kya Clark" }).click()
    //await expect(page.locator(".ownerFullName")).toHaveText("Kya Clark")
    const ownerKyaClarkDetails = ["Kya Clark", "Quality Street", "Cardiff", "9789090475"]
    let i = 0
    for (let info of ownerKyaClarkDetails) {

        await expect(page.locator("app-owner-detail table").first().locator("td").nth(i)).toHaveText(info)
        i = i + 1

    }
    await expect(page.locator("app-pet-list")).toHaveCount(2)
    await expect(page.locator("app-pet-list", { hasText: "cat" }).locator("dd").first()).toHaveText("Piper")
    await expect(page.locator("app-pet-list", { hasText: "dog" }).locator("dd").first()).toHaveText("Milo")

    await expect(page.locator("app-pet-list", { hasText: "Piper" }).locator("app-visit-list table > tr")).toHaveCount(10)

})