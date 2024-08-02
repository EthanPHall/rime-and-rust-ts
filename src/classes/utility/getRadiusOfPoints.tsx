import Vector2 from "./Vector2";

function getRadiusOfPoints(initialPoint: Vector2, radius: number): Vector2[] {
    const result: Vector2[] = [];
    
    for (let x = initialPoint.x - radius; x <= initialPoint.x + radius; x++) {
        for (let y = initialPoint.y - radius; y <= initialPoint.y + radius; y++) {
            const distance = Math.sqrt((x - initialPoint.x) ** 2 + (y - initialPoint.y) ** 2);
            if (distance <= radius) {
                result.push(new Vector2(x, y));
            }
        }
    }

    return result;
}

export default getRadiusOfPoints;