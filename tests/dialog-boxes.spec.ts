import { test, expect } from '@playwright/test';

test.beforeEach( async({page}) => {
    await page.goto('/')
    await page.getByTitle("pettypes").click()
})

test('Add and delete Pet type', async ({page}) => {

    const newPetTypeSection = page.locator("app-pettype-add")

    await expect(page.getByRole('heading')).toHaveText('Pet Types')
    await page.getByRole("button",{name: "Add"}).click()

    await expect(newPetTypeSection.getByRole("heading")).toHaveText("New Pet Type")
    await expect(newPetTypeSection.locator("label")).toHaveText("Name")
    await expect(newPetTypeSection.getByRole("textbox")).toBeVisible()

    await newPetTypeSection.getByRole("textbox").fill("pig")
    await page.getByRole("button",{name: "Save"}).click()
    await page.waitForTimeout(500)  //timeout added for Save action to complete
    await expect(page.getByRole("textbox").last()).toHaveValue("pig")  

    page.on('dialog', dialog =>{
        expect(dialog.message()).toEqual("Delete the pet type?")
        dialog.accept() 
    })
    await page.getByRole("button",{name: "Delete"}).last().click()
    await page.waitForResponse('**/pettypes/*')
    await expect(page.getByRole("textbox").last()).not.toHaveValue("pig")
})