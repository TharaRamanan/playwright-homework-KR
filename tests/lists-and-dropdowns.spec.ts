import { test, expect } from '@playwright/test';

test.beforeEach( async({page}) => {
    await page.goto('/')
    await page.getByRole('button', {name: "Owners"}).click()
    await page.getByRole('link', {name: "Search"}).click() 
})

test("Validate selected pet types from the list", async({page}) => {
    await expect(page.getByRole("heading")).toHaveText("Owners")
   
    await page.getByRole("link",{name: "George Franklin"}).click()
    await expect(page.getByRole('rowheader').nth(0)).toHaveText("Name")
    await expect(page.getByRole("row").nth(0).locator("td")).toHaveText("George Franklin")

    await page.getByRole("button",{name: "Edit Pet"}).click()
    await expect(page.getByRole("heading")).toHaveText("Pet")

    await expect(page.locator("#owner_name")).toHaveValue("George Franklin")
    await expect(page.locator("#type1")).toHaveValue("cat")

    const petTypes = ["cat","dog","lizard","snake","bird","hamster"]
    for(const pet of  petTypes ){
        
        await page.locator("#type").selectOption(pet)
        await expect(page.locator("#type1")).toHaveValue(pet)
    }   
})

test("Validate the pet type update", async({page}) => {
    await expect(page.getByRole("heading")).toHaveText("Owners")

    await page.getByRole("link",{name: "Eduardo Rodriquez"}).click()
    await page.getByRole("button",{name: "Edit Pet"}).nth(1).click()

    await expect(page.locator("#name")).toHaveValue("Rosy")
    await expect(page.locator("#type1")).toHaveValue("dog")

    await page.locator("#type").selectOption("bird")
    await expect(page.locator("#type1")).toHaveValue("bird")
    await expect(page.locator("select")).toHaveValue("bird")

    await page.getByRole("button",{name: "Update Pet"}).click()

    await expect(page.locator("dl", {hasText: "Rosy"}).locator("dd").nth(2)).toHaveText("bird")

    await page.getByRole("button",{name: "Edit Pet"}).nth(1).click()
    await expect(page.locator("#type1")).toHaveValue("bird")
    await page.locator("#type").selectOption("dog")
    await expect(page.locator("select")).toHaveValue("dog")
    await expect(page.locator("#type1")).toHaveValue("dog")
    await page.getByRole("button",{name: "Update Pet"}).click()
    await expect(page.locator("dl", {hasText: "Rosy"}).locator("dd").nth(2)).toHaveText("dog")   
})

