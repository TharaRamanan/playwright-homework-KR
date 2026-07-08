import { test, expect } from '@playwright/test'
import ownersObj from '../test-data/ownersList.json'
import firstOwnerInfoObj from '../test-data/ownerKyaClarkInfo.json'

test.describe("Mocking Owner info response", () => {
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

        for (const [i, info] of ownerKyaClarkDetails.entries()) {

            await expect(page.locator("app-owner-detail table").first().locator("td").nth(i)).toHaveText(info)

        }

        await expect(page.locator("app-pet-list")).toHaveCount(2)
        await expect(page.locator("app-pet-list", { hasText: "cat" }).locator("dd").first()).toHaveText("Piper")
        await expect(page.locator("app-pet-list", { hasText: "dog" }).locator("dd").first()).toHaveText("Milo")

        await expect(page.locator("app-pet-list", { hasText: "Piper" }).locator("app-visit-list table > tr")).toHaveCount(10)

    })
})

test('Intercept API response', async ({ page }) => {
    await page.route('*/**/api/vets', async route => {
        const interceptedResponse = await route.fetch()
        const responseBody = await interceptedResponse.json()
        responseBody[5].specialties = [
            { id: 9991, name: "dermatology" },
            { id: 9992, name: "surgery" },
            { id: 9993, name: "grooming" },
            { id: 9994, name: "dentistry" },
            { id: 9995, name: "therapy" },
            { id: 9996, name: "radiology" },
            { id: 9997, name: "oncology" },
            { id: 9998, name: "nutrition" },
            { id: 9999, name: "cardiology" },
            { id: 9990, name: "neurology" }
        ]

        await route.fulfill({
            body: JSON.stringify(responseBody)
        })
    })

    await page.goto('/')
    await page.getByRole('button', { name: "Veterinarians" }).click()
    await page.getByRole('link', { name: 'All' }).click()
    const sharonSpecialties = ["dermatology", "surgery", "grooming", "dentistry", "therapy", "radiology", "oncology", "nutrition", "cardiology", "neurology"]
    for (const [i, specialties] of sharonSpecialties.entries()) {
        await expect(page.locator("tr", { hasText: "Sharon Jenkins" }).locator("td").nth(1).locator("div").nth(i)).toHaveText(specialties)
    }
})