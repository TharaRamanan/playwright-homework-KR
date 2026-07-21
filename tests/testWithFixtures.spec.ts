import { test } from './testFixtures'
import { expect, request } from '@playwright/test'

test("Test with Fixtures", async ({ page, newOwnerData, request }) => {

    await page.goto("https://petclinic.bondaracademy.com/owners")
    console.log(newOwnerData.ownerId)
    await expect(page.getByRole("row").last().locator("td").first()).toHaveText("Rhonda Miles")
    await request.delete(`https://petclinic-api.bondaracademy.com/petclinic/api/owners/${newOwnerData.ownerId}`)
})