import { test as base, expect } from '@playwright/test'
import { faker } from '@faker-js/faker'


type testFixture = {
    newOwnerData: { ownerId: number, petId: number, visitId: number, firstname: string, lastname: string }
}

export const test = base.extend<testFixture>({
    newOwnerData: async ({ request }, use) => {
        const newOwnerCreationResponse = await request.post("https://petclinic-api.bondaracademy.com/petclinic/api/owners", {
            data: {
                "firstName": faker.person.firstName(),
                "lastName": faker.person.lastName(),
                "address": "Wallace Street",
                "city": "Bristol",
                "telephone": "9778487955"
            }
        })

        expect(newOwnerCreationResponse.status()).toBe(201)
        const newOwnerCreationResponseJson = await newOwnerCreationResponse.json()
        const newOwnerId = newOwnerCreationResponseJson.id
        const newOwnerFirstName = newOwnerCreationResponseJson.firstName
        const newOwnerLastName = newOwnerCreationResponseJson.lastName

        const newPetCreationResponse = await request.post(`https://petclinic-api.bondaracademy.com/petclinic/api/owners/${newOwnerId}/pets`, {
            data: {
                "name": "Rino",
                "birthDate": "2026-07-21",
                "type": {
                    "id": 2929,
                    "name": "cat"
                }
            }
        })
        expect(newPetCreationResponse.status()).toBe(201)
        const newPetCreationResponseJson = await newPetCreationResponse.json()
        const newPetId = newPetCreationResponseJson.id

        const newVisitCreationResponse = await request.post(`https://petclinic-api.bondaracademy.com/petclinic/api/owners/${newOwnerId}/pets/${newPetId}/visits`, {
            data: {
                "date": "2026-07-02",
                "description": "Yearly Checkup",
            }
        })

        expect(newVisitCreationResponse.status()).toBe(201)
        const newVisitCreationResponseJson = await newVisitCreationResponse.json()
        const newVisitId = newVisitCreationResponseJson.id

        await use({ ownerId: newOwnerId, petId: newPetId, visitId: newVisitId, firstname: newOwnerFirstName, lastname: newOwnerLastName })
        
        await request.delete(`https://petclinic-api.bondaracademy.com/petclinic/api/owners/${newOwnerId}`)
    }
})


