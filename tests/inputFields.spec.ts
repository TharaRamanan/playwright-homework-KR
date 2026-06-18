import { test, expect } from '@playwright/test';

test.beforeEach( async({page}) => {
    await page.goto('/')
    await page.getByTitle("pettypes").click()
})

test('Update Pet Type', async ({page}) => {

    const editPetTypeNameTextBox = page.getByRole('textbox')
    const firstRowInput = page.locator('[id="0"]')
    
    await expect(page.getByRole('heading')).toHaveText('Pet Types')

    await page.getByRole('row', {name: 'Cat'}).getByRole('button', {name: 'Edit'}).click()
    
    await expect(editPetTypeNameTextBox).toHaveValue('cat')

    await editPetTypeNameTextBox.fill('rabbit')
    await page.getByRole('button', {name: 'Update'}).click()
    await expect(firstRowInput).toHaveValue('rabbit')

    await page.getByRole('row', {name: 'rabbit'}).getByRole('button', {name: 'Edit'}).click()
    await expect(editPetTypeNameTextBox).toHaveValue('rabbit')
    await editPetTypeNameTextBox.fill('cat')
    await page.getByRole('button', {name: 'Update'}).click()

    await expect(firstRowInput).toHaveValue('cat')

})

test('Cancel Pet Type Update', async ({page}) => {
 
    const editPetTypeNameTextBox = page.getByRole('textbox')
    const secondRowInput = page.locator('[id="1"]')

    await expect(page.getByRole('heading')).toHaveText('Pet Types')

    await page.getByRole('row',{name: 'Dog'}).getByRole('button',{name:'Edit'}).click()
    await expect(editPetTypeNameTextBox).toHaveValue('dog')
    await editPetTypeNameTextBox.fill('moose')
    await expect(editPetTypeNameTextBox).toHaveValue('moose')
    await page.getByRole('button', {name: 'Cancel'}).click()
    await expect(secondRowInput).toHaveValue('dog')

})

test('Validate Pet type name', async ({page}) => {
  
    const editPetTypeNameTextBox = page.getByRole('textbox')

    await expect(page.getByRole('heading')).toHaveText('Pet Types')

    await page.getByRole('row',{name: 'lizard'}).getByRole('button',{name:'Edit'}).click()
    await expect(editPetTypeNameTextBox).toHaveValue('lizard')
    await editPetTypeNameTextBox.clear()
    await expect(page.locator('.help-block')).toHaveText('Name is required')
    await page.getByRole('button', {name: 'Update'}).click()
    await expect(page.getByRole('heading')).toHaveText('Edit Pet Type')
    await page.getByRole('button', {name: 'Cancel'}).click()

    await expect(page.getByRole('heading')).toHaveText('Pet Types')

})