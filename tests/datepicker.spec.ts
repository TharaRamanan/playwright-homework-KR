import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: "Owners" }).click()
    await page.getByRole('link', { name: "Search" }).click()
})

test("Select the desired date in the calendar", async ({ page }) => {
    const jinoPetSection = page.locator('app-pet-list', { hasText: "Jino" })

    await page.getByRole("link", { name: "Harold Davis" }).click()
    await page.waitForResponse("**/api/owners/*")
    await page.getByRole("button", { name: "Add New Pet" }).click()

    await page.getByRole("textbox", { name: "Name" }).fill("Jino")
    await expect(page.locator(".glyphicon-ok")).toBeVisible()
    await page.locator("#type").selectOption("dog")
    await page.getByRole("button", { name: "Open calendar" }).click()

    let currentMonthAndYear = await page.getByRole("button", { name: "Choose month and year" }).textContent()
    const expectedMonthAndYear = "05 2014"

    while (currentMonthAndYear != expectedMonthAndYear) {
        await page.locator("mat-calendar-header").getByRole("button", { name: "Previous month" }).click()
        currentMonthAndYear = await page.getByRole("button", { name: "Choose month and year" }).textContent()
    }

    await page.getByRole("button", { name: "2014/05/02" }).click()
    await expect(page.locator('[name="birthDate"]')).toHaveValue("2014/05/02")
    await page.getByRole("button", { name: "Save Pet" }).click()

    await expect(jinoPetSection.locator("dd").nth(0)).toHaveText("Jino")
    await expect(jinoPetSection.locator("dd").nth(1)).toHaveText("2014-05-02")
    await expect(jinoPetSection.locator("dd").nth(2)).toHaveText("dog")

    await jinoPetSection.getByRole("button", { name: "Delete Pet" }).click()
    await page.waitForResponse("**/api/pets/*")
    await expect(page.locator("app-pet-list:visible")).not.toContainText("Jino") 
})


test("Select the dates of visits and validate dates order", async ({ page }) => {

    
    await page.getByRole("link", { name: "Jean Coleman" }).click()
    await page.locator("app-pet-list",{hasText: "Samantha"}).getByRole("button",{name: "Add Visit"}).click()
    await page.getByRole("button", { name: "Open calendar" }).click()
    await page.locator(".mat-calendar-body-today").click()
    await expect(page.locator('[name="date"]')).toHaveValue(/^\d{4}\/\d{2}\/\d{2}$/)
    const expectedDate = await page.locator('[name="date"]').inputValue()
    await page.locator('[name="description"]').fill("Annual checkup")
    await page.getByRole("button", {name: "Add Visit"}).click()
    await page.waitForResponse("**/api/owners/*")

    const actualDate = await page.locator("app-pet-list",{hasText: "Samantha"}).locator("app-visit-list > table > tr").first().locator("td").first().textContent()
    



   
})
