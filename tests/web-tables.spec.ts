import { test, expect } from '@playwright/test';


test.describe("Pet Owners", () => {

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

test("Validate phone number and pet name", async({page})=>{
    const ownerPhoneNumberField = page.getByRole("row",{name: "6085552765"})
    const petName = await ownerPhoneNumberField.locator("td").last().innerText()
    
    await ownerPhoneNumberField.getByRole("link").click()
    await expect(page.getByRole("row",{name: "Telephone"}).locator("td")).toHaveText("6085552765")   
    
    await expect(page.locator("app-pet-list td dd").first()).toHaveText(petName)   
})

test("Validate pets of Madison city", async({page})=>{

    await page.waitForResponse("**/owners*")
    const tableRows = page.locator("#ownersTable tbody > tr ")

    const rowCount = await tableRows.count()
    let petArray = []
    
    for(let i = 0; i< rowCount; i++){

        const petOwnerColumnsField = page.locator("table tbody > tr").nth(i).locator("td")
        const cityName = await(petOwnerColumnsField.nth(2)).textContent()
        if(cityName == "Madison")
        {
            const getPetName = await(petOwnerColumnsField.nth(4)).textContent()
            petArray.push(getPetName)    
        }    
    }

expect(petArray).toEqual([' Leo ', ' George ', ' Mulligan ', ' Freddy '])   
})

})

test("Validate specialty update", async({page})=>{
    await page.goto('/')
    await page.getByRole('button',{name: "Veterinarians"}).click()
    await page.getByRole('link', { name: 'All' }).click()

    const rafaelRowField = page.getByRole("row",{name: "Rafael Ortega"})
    const editSpecialtyField = page.getByRole("textbox")

    await expect((rafaelRowField).locator("td").nth(1)).toHaveText("surgery")

    await page.getByRole("link",{name: "specialties"}).click()
    await expect(page.getByRole('heading')).toHaveText("Specialties")

    await page.getByRole("row",{name:"surgery"}).getByRole("button",{name: "Edit"}).click()
    await expect(page.getByRole('heading')).toHaveText("Edit Specialty")
    await expect(editSpecialtyField).toHaveValue("surgery")

    await editSpecialtyField.fill("dermatology")
    await expect(editSpecialtyField).toHaveValue("dermatology")
    await page.getByRole("button", {name: "Update"}).click()
    await expect(page.getByRole("row").nth(1).getByRole("textbox")).toHaveValue("dermatology")

    await page.getByRole('button',{name: "Veterinarians"}).click()
    await page.getByRole('link', { name: 'All' }).click()
    await expect((rafaelRowField).locator("td").nth(1)).toHaveText("dermatology")

    await page.getByRole("link",{name: "specialties"}).click()
    await page.getByRole("row",{name:"dermatology"}).getByRole("button",{name: "Edit"}).click()
    await page.waitForResponse("**/api/specialties/*")
    await editSpecialtyField.fill("surgery")
    await page.getByRole("button", {name: "Update"}).click()
})

test("Validate specialty lists", async({page})=>{
    await page.goto('/')
    await page.getByRole("link",{name: "specialties"}).click()

    const allSpecialtiesArray = []

    await page.getByRole("button",{name: "Add"}).click()
    await page.locator("#name").fill("oncology")
    await page.getByRole("button",{name: "Save"}).click()
    await page.waitForResponse("**/api/specialties")
    
    const totalRowFieldInSpecialtiesTable = await page.locator("tbody tr").count()
    for(let i = 0; i< totalRowFieldInSpecialtiesTable; i++) {

        const specialtyValue = await page.locator("tbody tr").nth(i).locator("td input").inputValue()
        allSpecialtiesArray.push(specialtyValue)

    }
    console.log(allSpecialtiesArray)

   


})
