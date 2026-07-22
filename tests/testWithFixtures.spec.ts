import { test } from './testFixtures'
import { expect } from '@playwright/test'

test("Test with Fixtures", async ({ page, newOwnerData }) => {

    await page.goto("/owners")
    await page.getByRole("link",{name: `${newOwnerData.firstname} ${newOwnerData.lastname}`}).click()
    await page.getByRole("row",{name:"Rino"}).getByRole("button",{name:"Delete Visit"}).click()
    await page.getByRole("row",{name:"Rino"}).getByRole("button",{name:"Delete Pet"}).click()

    await expect(page.getByRole("row",{name: "Rino"})).toHaveCount(0)
    await page.getByRole("button",{name: "Back"}).click()
    
})