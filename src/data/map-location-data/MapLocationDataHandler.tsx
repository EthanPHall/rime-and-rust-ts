import mapLocationData from './map-location-data.json';

interface MapLocationData{
    'name': string;
    'symbol': string;
    'bgLocation': boolean;
}

function GetRandomBackgroundLocation(): MapLocationData{
    let allBGLocations: MapLocationData[] = [];

    Object.entries(mapLocationData).forEach(([key, value])=> {
        const data:MapLocationData = value as MapLocationData; 
        if(data.bgLocation){
            allBGLocations.push(data);
        }
    });

    const randomIndex:number = Math.floor(Math.random() * allBGLocations.length);

    return allBGLocations[randomIndex];
}

export {type MapLocationData, GetRandomBackgroundLocation}; 