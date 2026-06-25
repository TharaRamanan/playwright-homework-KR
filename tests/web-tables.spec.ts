import { test, expect } from '@playwright/test';

test.beforeEach( async({page}) => {
    await page.goto('/')
    await page.getByRole('button', {name: "Owners"}).click()
    await page.getByRole('link', {name: "Search"}).click() 
    
})

test("Validate pet name and city of the owner", async({page})=>{
   const jeffRow = page.getByRole("row",{name: "Jeff Black"}).locator("td")
   const cityName = await jeffRow.nth(2).textContent()
   const petName =  await jeffRow.nth(4).textContent()
   
   expect(cityName).toEqual("Monona")
   expect(petName?.trim()).toEqual("Lucky")
})

test("Validate owners count of Madison city", async({page})=>{
    const madisonRows = page.getByRole("row", { name: "Madison" })
    await expect(madisonRows).toHaveCount(4)
    
})

test("Validate search by last name", async({page})=>{
    const lastNameInputField =  page.getByRole("textbox")
    const ownerNames = ["Black", "Davis", "Es", "Playwright"]
    
    for(const owner of ownerNames){
    await lastNameInputField.fill(owner)
    await page.getByRole("button",{name: "Find Owner"}).click()
    await page.waitForResponse("**/owners*")
    if(owner =="Playwright"){
        await expect(page.locator("app-owner-list div").nth(7)).toContainText('No owners with LastName starting with "Playwright"')
    }
    else{
    const ownerFullName = await page.getByRole("row",{name: owner}).locator("td").first().textContent()
    expect(ownerFullName).toContain(owner)
    }

    }    
})