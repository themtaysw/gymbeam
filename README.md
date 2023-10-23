# GymBeam Case Study

## Introduction
My initial idea was to use some advanced techniques to solve the problem (Dijkstra's algorithm or A*), but I decided to go with a simple approach. After a bit of research online (mainly StackOverflow) I found a way to solve it using 2 simple JS functions (Math.sqrt and Math.pow).

##### 1.
From the original docs which contains a response:

```
[
    {
        "positionId": "position-31",
        "x": 3,
        "y": 1,
        "z": 0,
        "productId": "product-1",
        "quantity": 13
    }
]
```
I needed to create a simple Array of products:
```javascript
const products: string[] = req.body.products
```
then I needed to fetch the positions for each product:
```javascript
const productPositions: any[] = []
    for (const product of products) {
        try {
            const response = await axios.get(`${URLS.PRODUCTS}/${product}/positions`,
                {
                    headers: {
                        'x-api-key': API_KEY
                    }
                })
            productPositions.push(...response.data)
        }
        catch (error) {
            console.error(`Error fetching positions for product: ${product}`, error)
            return res.status(500).send("Failed to fetch product positions")
        }
    }
```
then I can sort the positions by distance from the starting position:
```javascript
const sortedPositions = productPositions.sort((a, b) => {
    const distanceA = computeDistance(startingPosition, a)
    const distanceB = computeDistance(startingPosition, b)
    return distanceA - distanceB
})
```
finally I can compute the total distance:

```javascript
let totalDistance = 0
for (let i = 0; i < sortedPositions.length - 1; i++) {
    totalDistance += computeDistance(sortedPositions[i], sortedPositions[i + 1])
}
```

##### 2.
Compute distance between 2 positions (using Pythagorean theorem):

```javascript
const computeDistance = (position1, position2) => {
    return Math.sqrt(
        Math.pow(position2.x - position1.x, 2) +
        Math.pow(position2.y - position1.y, 2) +
        Math.pow(position2.z - position1.z, 2)
    )
}
```
