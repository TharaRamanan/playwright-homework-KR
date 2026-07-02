import { test, expect } from '@playwright/test';

test.describe("Pet Owners", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/')
        await page.getByRole('button', { name: "Owners" }).click()
        await page.getByRole('link', { name: "Search" }).click()

    })

    test("Validate pet name and city of the owner", async ({ page }) => {
        const jeffBlackRow = page.getByRole("row", { name: "Jeff Black" }).locator("td")
        await expect(jeffBlackRow.nth(2)).toHaveText("Monona")
        await expect(jeffBlackRow.nth(4)).toHaveText("Lucky")
    })

    test("Validate owners count of Madison city", async ({ page }) => {
        await expect(page.getByRole("row", { name: "Madison" })).toHaveCount(4)
    })

    test("Validate search by last name", async ({ page }) => {
        const lastNameInputField = page.getByRole("textbox")
        const ownerNames = ["Black", "Davis", "Es", "Playwright"]

        for (const owner of ownerNames) {
            await lastNameInputField.fill(owner)
            await page.getByRole("button", { name: "Find Owner" }).click()
            await page.waitForResponse("**/owners*")
            if (owner == "Playwright") {
                await expect(page.locator("app-owner-list div").last()).toContainText('No owners with LastName starting with "Playwright"')

            }
            else {
                await expect(page.getByRole("row", { name: owner }).locator("td").first()).toContainText(owner)
            }
        }
    })

    test("Validate phone number and pet name", async ({ page }) => {
        const petName = await page.getByRole("row", { name: "6085552765" }).locator("td").last().innerText()
        await page.getByRole("row", { name: "6085552765" }).getByRole("link").click()
        await expect(page.getByRole("row", { name: "Telephone" }).locator("td")).toHaveText("6085552765")

        await expect(page.locator("app-pet-list td dd").first()).toHaveText(petName)
    })

    test("Validate pets of Madison city", async ({ page }) => {

        await page.waitForResponse("**/owners*")
        const madisonRows = await page.getByRole("row", { name: "Madison" })

        let petArray = []
        for (let row of await madisonRows.all()) {

            const getPetName = await row.locator("td").nth(4).textContent()
            petArray.push(getPetName)

        }

        expect(petArray).toEqual([' Leo ', ' George ', ' Mulligan ', ' Freddy '])
    })

})


test("Validate specialty update", async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: "Veterinarians" }).click()
    await page.getByRole('link', { name: 'All' }).click()

    const rafaelOrtegaRow = page.getByRole("row", { name: "Rafael Ortega" })
    const editSpecialtyField = page.getByRole("textbox")

    await expect((rafaelOrtegaRow).locator("td").nth(1)).toHaveText("surgery")

    await page.getByRole("link", { name: "specialties" }).click()
    await expect(page.getByRole('heading')).toHaveText("Specialties")

    await page.getByRole("row", { name: "surgery" }).getByRole("button", { name: "Edit" }).click()
    await expect(page.getByRole('heading')).toHaveText("Edit Specialty")
    await expect(editSpecialtyField).toHaveValue("surgery")

    await editSpecialtyField.fill("dermatology")
    await expect(editSpecialtyField).toHaveValue("dermatology")
    await page.getByRole("button", { name: "Update" }).click()
    await expect(page.getByRole("row").nth(1).getByRole("textbox")).toHaveValue("dermatology")

    await page.getByRole('button', { name: "Veterinarians" }).click()
    await page.getByRole('link', { name: 'All' }).click()
    await expect(rafaelOrtegaRow.locator("td").nth(1)).toHaveText("dermatology")

    await page.getByRole("link", { name: "specialties" }).click()
    await page.getByRole("row", { name: "dermatology" }).getByRole("button", { name: "Edit" }).click()
    await expect(editSpecialtyField).toHaveValue("dermatology")
    await editSpecialtyField.fill("surgery")
    await page.getByRole("button", { name: "Update" }).click()
})

test("Validate specialty lists", async ({ page }) => {
    await page.goto('/')
    await page.getByRole("link", { name: "specialties" }).click()

    const allSpecialtiesArray = []
    const vetSharonJenkinsRow = page.getByRole("row", { name: "Sharon Jenkins" })

    await page.getByRole("button", { name: "Add" }).click()
    await page.locator("#name").fill("oncology")
    await page.getByRole("button", { name: "Save" }).click()
    await page.waitForResponse("**/api/specialties")

    const totalRowFieldInSpecialtiesTable = page.locator("tbody tr")
    for (let row of await totalRowFieldInSpecialtiesTable.all()) {

        const specialtyValue = await row.locator("td input").inputValue()
        allSpecialtiesArray.push(specialtyValue)
    }

    await page.getByRole('button', { name: "Veterinarians" }).click()
    await page.getByRole('link', { name: 'All' }).click()
    await vetSharonJenkinsRow.getByRole("button", { name: "Edit Vet" }).click()
    await page.locator(".dropdown-arrow").click()

    const dropdownOptions = page.locator(".dropdown-content label")
    const dropdownOptionsArray = await dropdownOptions.allInnerTexts()
    expect(dropdownOptionsArray).toEqual(allSpecialtiesArray)

    await page.getByRole("checkbox", { name: "oncology" }).check()
    await page.locator(".dropdown-arrow").click()
    await page.getByRole("button", { name: "Save Vet" }).click()
    await expect(vetSharonJenkinsRow.locator("td").nth(1)).toHaveText("oncology")

    await page.getByRole("link", { name: "specialties" }).click()
    await page.getByRole("row", { name: "oncology" }).getByRole("button", { name: "Delete" }).click()

    await page.getByRole('button', { name: "Veterinarians" }).click()
    await page.getByRole('link', { name: 'All' }).click()
    await expect(vetSharonJenkinsRow.locator("td").nth(1)).toBeEmpty()

})
