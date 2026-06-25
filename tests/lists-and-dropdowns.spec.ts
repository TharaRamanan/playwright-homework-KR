import { test, expect } from '@playwright/test';

test.beforeEach( async({page}) => {
    await page.goto('/')
    await page.getByRole('button', {name: "Owners"}).click()
    await page.getByRole('link', {name: "Search"}).click() 
    
})

test("Validate selected pet types from the list", async({page}) => {
    const leoPetSection =  page.locator('app-pet-list',{hasText: "Leo"})
    await expect(page.getByRole("heading")).toHaveText("Owners")
   
    await page.getByRole("link",{name: "George Franklin"}).click()
    await expect(page.getByRole("row", {name: 'Name'}).locator("td").nth(0)).toHaveText("George Franklin")
    
    await leoPetSection.getByRole("button",{name: "Edit Pet"}).click()
    await expect(page.getByRole("heading")).toHaveText("Pet")

    await expect(page.locator("#owner_name")).toHaveValue("George Franklin")
    await expect(page.locator("#type1")).toHaveValue("cat")

    const petTypes = await page.locator("#type option").allTextContents()
    for(const pet of  petTypes ){
        
        await page.locator("#type").selectOption(pet)
        await expect(page.locator("#type1")).toHaveValue(pet)
    }   
    
})

test("Validate the pet type update", async({page}) => {
    const selectedPetType = page.locator("#type1")
    const rosyPetSection =  page.locator('app-pet-list',{hasText: "Rosy"})
    await expect(page.getByRole("heading")).toHaveText("Owners")

    await page.getByRole("link",{name: "Eduardo Rodriquez"}).click()
    await rosyPetSection.getByRole("button",{name: "Edit Pet"}).click()

    await expect(page.locator("#name")).toHaveValue("Rosy")
    await expect(selectedPetType).toHaveValue("dog")

    await page.locator("#type").selectOption("bird")
    await expect(selectedPetType).toHaveValue("bird")
    await expect(page.locator("select")).toHaveValue("bird")

    await page.getByRole("button",{name: "Update Pet"}).click()
    await expect(rosyPetSection.locator("dd").nth(2)).toHaveText("bird")

    await rosyPetSection.getByRole("button",{name: "Edit Pet"}).click()
    await expect(selectedPetType).toHaveValue("bird")
    await page.locator("#type").selectOption("dog")
    await expect(page.locator("select")).toHaveValue("dog")
    await expect(selectedPetType).toHaveValue("dog")
    await page.getByRole("button",{name: "Update Pet"}).click()
    await expect(rosyPetSection.locator("dd").nth(2)).toHaveText("dog") 
})

