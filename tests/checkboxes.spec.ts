import { test, expect } from '@playwright/test';

test.beforeEach( async({page}) => {
    await page.goto('/')
    await page.getByRole('button',{name: "Veterinarians"}).click()
    await page.getByRole('link', { name: 'All' }).click()
})

test('Validate Selected Specialities', async ({page}) => {

       const selectedSpecialties = page.locator(".selected-specialties")
       await expect(page.getByRole('heading')).toHaveText("Veterinarians")
       await page.getByRole('row',{name:'Helen Leary'}).getByRole('button',{name: "Edit Vet"}).click()
       await expect(selectedSpecialties).toHaveText("radiology")
       await selectedSpecialties.click()

       await expect(page.getByRole('checkbox',{name: "radiology"})).toBeChecked()
       await expect(page.getByRole('checkbox',{name: "surgery"})).not.toBeChecked()
       await expect(page.getByRole('checkbox',{name: "dentistry"})).not.toBeChecked()

       await page.getByRole('checkbox',{name: "surgery"}).check()
       await page.getByRole('checkbox',{name: "radiology"}).uncheck()
       await expect(selectedSpecialties).toHaveText("surgery")
       await page.getByRole('checkbox',{name: "dentistry"}).check()
       await expect(selectedSpecialties).toHaveText("surgery, dentistry")
       await selectedSpecialties.click()
       
})

test('Select all specialties', async ({page}) => {   
    
    const selectedSpecialties = page.locator(".selected-specialties")
    await page.getByRole('row',{name:'Rafael Ortega'}).getByRole('button',{name: "Edit Vet"}).click()
    await expect(selectedSpecialties).toHaveText("surgery")
    await selectedSpecialties.click()

    const allSpecialtiesBoxes = page.getByRole("checkbox")
    for (const speciality of await  allSpecialtiesBoxes.all()) {

        await speciality.check()
        await expect(speciality).toBeChecked()
    }
    await selectedSpecialties.click()
    await expect(selectedSpecialties).toHaveText("surgery, radiology, dentistry")

})

test('Unselect all specialties', async ({page}) => {   
    const selectedSpecialties = page.locator(".selected-specialties")
    await page.getByRole('row',{name:'Linda Douglas'}).getByRole('button',{name: "Edit Vet"}).click()
    await expect(selectedSpecialties).toHaveText("dentistry, surgery")

    await selectedSpecialties.click()
    const allSpecialtiesBoxes = page.getByRole("checkbox")
    for (const speciality of await  allSpecialtiesBoxes.all()) {

        await speciality.uncheck()
        await expect(speciality).not.toBeChecked()
    }    
    await expect(selectedSpecialties).toBeEmpty()

})


