import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
    await page.goto('/')
})

test('Validation of delete specialty', async ({ page, request }) => {
    await page.getByRole("link", { name: "Specialties" }).click()

    await request.post("https://petclinic-api.bondaracademy.com/petclinic/api/specialties", {
        data: { name: "api testing expert" }
    })

    await page.waitForResponse("**/api/specialties")
    await expect(page.locator("#specialties").locator("tbody > tr").last().getByRole("textbox")).toHaveValue("api testing expert")
    await page.locator("tbody >tr").last().getByRole("button", { name: "Delete" }).click()
    await page.waitForResponse("**/api/specialties/*")
    await expect(page.locator("#specialties").locator("tbody > tr").last().getByRole("textbox")).not.toHaveValue("api testing expert")

})

test('Add and Delete Veterinarian', async ({ page, request }) => {
    const addVetResponse = await request.post("https://petclinic-api.bondaracademy.com/petclinic/api/vets", {
        data: { "firstName": "Rani", "lastName": "Pratap", "id": null, "specialties": [] }
    })

    expect(addVetResponse.status()).toEqual(201)
    const addVetResponseJson = await addVetResponse.json()
    const newVetID = addVetResponseJson.id

    await page.getByRole('button', { name: "Veterinarians" }).click()
    await page.getByRole('link', { name: 'All' }).click()

    await expect(page.locator("#vets tbody > tr").last().locator("td").first()).toHaveText("Rani Pratap")
    await expect(page.locator("#vets tbody > tr").last().locator("td").nth(1)).toBeEmpty()

    await page.locator("#vets tbody > tr", { hasText: "Rani Pratap" }).getByRole("button", { name: "Edit Vet" }).click()
    await expect(page.getByRole("heading")).toHaveText("Edit Veterinarian")
    await page.locator(".dropdown-arrow").click()
    await page.getByRole('checkbox', { name: "dentistry" }).check()
    await page.locator(".dropdown-arrow").click()
    await page.getByRole("button", { name: "Save Vet" }).click()
    await expect(page.locator("#vets tbody > tr", { hasText: "Rani Pratap" }).locator("td").nth(1)).toHaveText("dentistry")

    const deleteVetResponse = await request.delete(`https://petclinic-api.bondaracademy.com/petclinic/api/vets/${newVetID}`)

    expect(deleteVetResponse.status()).toEqual(204)

    const vetList = await (await request.get("https://petclinic-api.bondaracademy.com/petclinic/api/vets")).json()
    const vetIds = vetList.map(vet => vet.id)
    expect(vetIds).not.toContain(newVetID)

})

test('New specialty is displayed', async ({ page, request }) => {

    const addSpecialtyResponse = await request.post("https://petclinic-api.bondaracademy.com/petclinic/api/specialties", {
        data: { name: "api testing ninja" }
    })
    expect(addSpecialtyResponse.status()).toEqual(201)
    const newSpecialtyID = (await addSpecialtyResponse.json()).id

    const addVetResponse = await request.post("https://petclinic-api.bondaracademy.com/petclinic/api/vets", {
        data: { "firstName": "Ganesh", "lastName": "Parvathi", "id": null, "specialties": [{ "id": 4829, "name": "surgery" }] }
    })
    expect(addVetResponse.status()).toEqual(201)
    const newVetID = (await addVetResponse.json()).id

    await page.getByRole('button', { name: "Veterinarians" }).click()
    await page.getByRole('link', { name: 'All' }).click()
    await expect(page.locator("#vets tbody > tr").last().locator("td").first()).toHaveText("Ganesh Parvathi")
    await expect(page.locator("#vets tbody > tr").last().locator("td").nth(1)).toHaveText("surgery")
    await page.locator("#vets tbody > tr", { hasText: "Ganesh Parvathi" }).getByRole("button", { name: "Edit Vet" }).click()
    await page.locator(".dropdown-arrow").click()
    await page.getByRole('checkbox', { name: "surgery" }).uncheck()
    await page.getByRole('checkbox', { name: "api testing ninja" }).check()
    await page.locator(".dropdown-arrow").click()
    await page.getByRole("button", { name: "Save Vet" }).click()
    await expect(page.locator("#vets tbody > tr").last().locator("td").nth(1)).toHaveText("api testing ninja")

    const deleteVetResponse = await request.delete(`https://petclinic-api.bondaracademy.com/petclinic/api/vets/${newVetID}`)
    expect(deleteVetResponse.status()).toEqual(204)

    const deleteSpecialtyResponse = await request.delete(`https://petclinic-api.bondaracademy.com/petclinic/api/specialties/${newSpecialtyID}`)
    expect(deleteSpecialtyResponse.status()).toEqual(204)

    await page.getByRole("link", { name: "Specialties" }).click()
    await page.waitForResponse("**/api/specialties")
    await expect(page.locator("#specialties").locator("tbody > tr").last().getByRole("textbox")).not.toHaveValue("api testing ninja")
})

