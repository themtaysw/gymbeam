interface Position {
    x: number;
    y: number;
    z: number;
}

// this function computes the distance between two positions in 3D space
const computeDistance = (position1: Position, position2: Position) => {
    // square root of the sum of the squares of the differences between the coordinates
    return Math.sqrt(
        Math.pow(position2.x - position1.x, 2) +
        Math.pow(position2.y - position1.y, 2) +
        Math.pow(position2.z - position1.z, 2)
    )
}

export default computeDistance
