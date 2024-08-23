import { RNGFunction } from '../../context/misc/SettingsContext';
import mapLocationData from './map-location-data.json';

interface MapLocationData{
    'name': string;
    'symbol': string;
    'bgLocation': boolean;
}

function GetRandomBackgroundLocation(rngFunction:RNGFunction): MapLocationData{
    let allBGLocations: MapLocationData[] = [];

    Object.entries(mapLocationData).forEach(([key, value])=> {
        const data:MapLocationData = value as MapLocationData; 
        if(data.bgLocation){
            allBGLocations.push(data);
        }
    });

    const randomIndex:number = rngFunction(0, allBGLocations.length-1);

    return allBGLocations[randomIndex];
}

export {type MapLocationData, GetRandomBackgroundLocation}; 