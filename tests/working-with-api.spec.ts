import { test, expect } from '@playwright/test'
import ownersObj from '../test-data/ownersList.json'
import kyaClarkInfoObj from '../test-data/ownerKyaClarkInfo.json'
import sharonJenkinsSpecialtiesObj from '../test-data/vetSharonJenkinsSpecialties.json'

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

    test.only('mocking API request', async ({ page }) => {
        await expect(page.locator("#ownersTable").locator("tbody > tr")).toHaveCount(2)
        await page.route("**/api/owners/*", async route => {
            await route.fulfill({
                contentType: "application/json",
                body: JSON.stringify(kyaClarkInfoObj)
            })

        })
        await page.getByRole("link", { name: "Kya Clark" }).click()
        await expect(page.getByRole("row", { name: "Name" }).first()).toContainText(`${kyaClarkInfoObj.firstName} ${kyaClarkInfoObj.lastName}`)
        await expect(page.getByRole("row", { name: "Address" })).toContainText(kyaClarkInfoObj.address)
        await expect(page.getByRole("row", { name: "City" })).toContainText(kyaClarkInfoObj.city)
        await expect(page.getByRole("row", { name: "Telephone" })).toContainText(kyaClarkInfoObj.telephone)


        await expect(page.locator("app-pet-list")).toHaveCount(2)
        await expect(page.locator("app-pet-list", { hasText: "cat" }).locator("dd").first()).toHaveText("Piper")
        await expect(page.locator("app-pet-list", { hasText: "dog" }).locator("dd").first()).toHaveText("Milo")

        await expect(page.locator("app-pet-list", { hasText: "Piper" }).locator("app-visit-list table > tr")).toHaveCount(10)

    })
})

test('Intercept API response', async ({ page }) => {
    await page.route('*/**/api/vets', async route => {
        const interceptedResponse = await route.fetch()
        const responseBodyJson = await interceptedResponse.json()
        const updatedSpecialtiesResponseJson = responseBodyJson.map(vet => {
            if (vet.firstName === 'Sharon' && vet.lastName === 'Jenkins') {
                return {
                    ...vet, specialties: sharonJenkinsSpecialtiesObj
                }
            }
            return vet
        })
        await route.fulfill({
            body: JSON.stringify(updatedSpecialtiesResponseJson)
        })
    })

    await page.goto('/')
    await page.getByRole('button', { name: "Veterinarians" }).click()
    await page.getByRole('link', { name: 'All' }).click()

    for (let i = 0; i < sharonJenkinsSpecialtiesObj.length; i++) {
        await expect(page.locator("tr", { hasText: "Sharon Jenkins" }).locator("td").nth(1).locator("div").nth(i)).toHaveText(sharonJenkinsSpecialtiesObj[i].name)
    }
})