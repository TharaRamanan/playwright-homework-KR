import { test, expect } from '@playwright/test';


test.only("visual testing", async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: "Owners" }).click()
    await page.getByRole('link', { name: "Add New" }).click()
    
    await expect(page.getByRole("button",{name: "Add Owner"})).toHaveScreenshot()

    await page.getByRole("textbox",{name: "First Name"}).fill("Jacob")
    await page.getByRole("textbox",{name: "Last Name"}).fill("Hill")
    await page.getByRole("textbox",{name: "Address"}).fill("55 Hillmain Street")
    await page.getByRole("textbox",{name: "City"}).fill("Belgium")
    await page.getByRole("textbox",{name: "Telephone"}).fill("9789090472")

    await expect(page.getByRole("button",{name: "Add Owner"})).toHaveScreenshot()

})

