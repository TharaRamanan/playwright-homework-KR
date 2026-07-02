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
    const date = new Date()
    const currentDay = String(date.getDate()).padStart(2, '0')
    const currentMonth = String(date.getMonth() + 1).padStart(2, '0')
    const currentyear = date.getFullYear()
    const expectedDate = `${currentyear}-${currentMonth}-${currentDay}`

    const pastDate = new Date()
    pastDate.setDate(pastDate.getDate() - 45)
    const retroMonth = String(pastDate.getMonth() + 1).padStart(2, '0')
    const retroDate = String(pastDate.getDate()).padStart(2, '0')
    const retroYear = pastDate.getFullYear()

    const petSamanthaSection = page.locator("app-pet-list", { hasText: "Samantha" })

    await page.getByRole("link", { name: "Jean Coleman" }).click()
    await petSamanthaSection.getByRole("button", { name: "Add Visit" }).click()
    await page.getByRole("button", { name: "Open calendar" }).click()
    await page.locator(".mat-calendar-body-today").click()
    await expect(page.locator('[name="date"]')).toHaveValue(/^\d{4}\/\d{2}\/\d{2}$/)
    await page.locator('[name="description"]').fill("Annual checkup")
    await page.getByRole("button", { name: "Add Visit" }).click()
    await page.waitForResponse("**/api/owners/*")

    const actualDate = await petSamanthaSection.locator("app-visit-list > table > tr").first().locator("td").first().textContent()
    expect(actualDate).toEqual(expectedDate)

    await petSamanthaSection.getByRole("button", { name: "Add Visit" }).click()

    await page.getByRole("button", { name: "Open calendar" }).click()
    let currentMonthAndYear = await page.getByRole("button", { name: "Choose month and year" }).textContent()
    const expectedMonthAndYear = `${retroMonth} ${retroYear}`

    while (currentMonthAndYear != expectedMonthAndYear) {
        await page.locator("mat-calendar-header").getByRole("button", { name: "Previous month" }).click()
        currentMonthAndYear = await page.getByRole("button", { name: "Choose month and year" }).textContent()
    }

    await page.getByRole("button", { name: `${retroYear}/${retroMonth}/${retroDate}` }).click()
    await page.locator('[name="description"]').fill("Dental work")
    await page.getByRole("button", { name: "Add Visit" }).click()
    await page.waitForResponse("**/api/owners/*")

    const rows = await petSamanthaSection.locator("app-visit-list > table > tr").all()

    for (let i = 0; i < rows.length - 1; i++) {
        const currentDate = new Date(await rows[i].locator("td").first().innerText())
        const nextDate = new Date(await rows[i + 1].locator("td").first().innerText())
        expect(currentDate >= nextDate).toBeTruthy()
    }

})
