import { test, expect } from '@playwright/test';

test.beforeEach( async({page}) => {
    await page.goto('/')
    await page.getByTitle("pettypes").click()
})

test('Add and delete Pet type', async ({page}) => {

    const newPetTypeSection = page.locator("app-pettype-add")
    const totalRows = page.locator("table tbody tr")
    await expect(page.getByRole('heading')).toHaveText('Pet Types')
    await page.getByRole("button",{name: "Add"}).click()

    await expect(newPetTypeSection.getByRole("heading")).toHaveText("New Pet Type")
    await expect(newPetTypeSection.locator("label")).toHaveText("Name")
    await expect(newPetTypeSection.getByRole("textbox")).toBeVisible()

    await newPetTypeSection.locator("#name").fill("pig")
    await page.getByRole("button",{name: "Save"}).click()
    await page.waitForTimeout(500)  //timeout added for Save action to complete

    const noTotalRows =  await totalRows.count()
    await expect(page.getByRole("textbox").nth(noTotalRows-1)).toHaveValue("pig")   //to verify last row has the newly added value 'pig'
    await page.getByRole("button",{name: "Delete"}).nth(noTotalRows-1).click()
    
    //page.on('dialog', dialog =>{
        //dialog.accept()
   // })
})