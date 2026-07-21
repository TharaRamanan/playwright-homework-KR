import { test as base } from '@playwright/test'

type testFixture = {
    newOwnerData: { ownerId: number, petId: number, visitId: number }
}

export const test = base.extend<testFixture>({
    newOwnerData: async ({ request }, use) => {
        const newOwnerCreationResponse = await request.post("https://petclinic-api.bondaracademy.com/petclinic/api/owners", {
            data: {
                "firstName": "Rhonda",
                "lastName": "Miles",
                "address": "Wallace Street",
                "city": "Bristol",
                "telephone": "9778487955"
            }
        })

        const newOwnerCreationResponseJson = await newOwnerCreationResponse.json()
        const newOwnerId = newOwnerCreationResponseJson.id

        const newPetCreationResponse = await request.post(`https://petclinic-api.bondaracademy.com/petclinic/api/owners/${newOwnerId}/pets`, {
            data: {
                "name": "Rino",
                "birthDate": "2026-07-21",
                "type": {
                    "name": "cat"
                }
            }
        })

        const newPetCreationResponseJson = await newPetCreationResponse.json()
        const newPetId = newPetCreationResponseJson.id

        const newVisitCreationResponse = await request.post(`https://petclinic-api.bondaracademy.com/petclinic/api/owners/${newOwnerId}/pets/${newPetId}/visits`, {
            data: {
                "date": "2026-07-02",
                "description": "Annual Checkup",
                "id": null,
                "pet": {
                    "name": "Rosy",
                    "birthDate": "2026-07-01",
                    "type": { "name": "cat", "id": 2929 },
                    "id": newPetId,
                    "ownerId": newOwnerId,
                    "visits": []
                }
            }
        })

        const newVisitCreationResponseJson = await newVisitCreationResponse.json()
        const newVisitId = newVisitCreationResponseJson.id

        await use({ ownerId: newOwnerId, petId: newPetId, visitId: newVisitId })
    }
})


