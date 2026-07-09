import { test, expect } from '@playwright/test'
import ownersObj from '../test-data/ownersList.json'
import kyaClarkInfoObj from '../test-data/ownerKyaClarkInfo.json'

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
            body: JSON.stringify(kyaClarkInfoObj)
        })

    })
    await page.getByRole("link", { name: "Kya Clark" }).click()
    await expect(page.getByRole("row",{name: "Name"}).first()).toContainText(`${kyaClarkInfoObj.firstName} ${kyaClarkInfoObj.lastName}`)
    await expect(page.getByRole("row",{name: "Address"})).toContainText(kyaClarkInfoObj.address)
    await expect(page.getByRole("row",{name: "City"})).toContainText(kyaClarkInfoObj.city)
    await expect(page.getByRole("row",{name: "Telephone"})).toContainText(kyaClarkInfoObj.telephone)


    await expect(page.locator("app-pet-list")).toHaveCount(2)
    await expect(page.locator("app-pet-list", { hasText: "cat" }).locator("dd").first()).toHaveText("Piper")
    await expect(page.locator("app-pet-list", { hasText: "dog" }).locator("dd").first()).toHaveText("Milo")

    await expect(page.locator("app-pet-list", { hasText: "Piper" }).locator("app-visit-list table > tr")).toHaveCount(10)

})