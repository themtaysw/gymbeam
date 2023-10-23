import axios from "axios"
import { Router, Request, Response } from "express"

import { URLS } from "../utils/urls"
import computeDistance from "../functions/computeDistance"
import { TProductPosition } from "../models/productposition"

const router = Router()

// the API key is stored in the .env file but it is not included in the repository
const API_KEY = process.env.API_KEY! || "MVGBMS0VQI555bTery9qJ91BfUpi53N24SkKMf9Z"

// find the shortest path
router.get("/find", async (req: Request, res: Response) => {
    const products: string[] = req.body.products                                        // array of products
    const startingPosition = req.body.startingPosition                                  // starting position of the picker -> { x: number, y: number, z: number }

    // check if the products are valid
    if (!Array.isArray(products)) {
        return res.status(400).send("Invalid products provided")
    }

    // array of products positions
    const productPositions: TProductPosition[] = []
    for (const product of products) {                                                // for each product in the array of products
        try {
            // fetch the positions of the product
            const response = await axios.get(`${URLS.PRODUCTS}/${product}/positions`,
                {
                    headers: {
                        'x-api-key': API_KEY
                    }
                })
            // push the positions to the array of products positions
            productPositions.push(...response.data)
        }
        catch (error) {
            console.error(`Error fetching positions for product: ${product}`, error)
            return res.status(500).send("Failed to fetch product positions")
        }
    }

    // sort the positions by distance from the starting position
    const sortedPositions = productPositions.sort((a, b) => {
        const distanceA = computeDistance(startingPosition, a)                       // compute the distance between the starting position and the position a
        const distanceB = computeDistance(startingPosition, b)                       // compute the distance between the starting position and the position b
        return distanceA - distanceB
    })

    // compute the total distance
    let totalDistance = 0
    for (let i = 0; i < sortedPositions.length - 1; i++) {                          // for each position in the array of sorted positions
        totalDistance += computeDistance(sortedPositions[i], sortedPositions[i + 1])// compute the distance between the position[i] and the position[i + 1]
    }

    // return the response predefined by the task
    res.json({
        pickingOrder: sortedPositions.map(pos => ({
            productId: pos.productId,
            positionId: pos.positionId
        })),
        distance: totalDistance
    })
})

export default router
