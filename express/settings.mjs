/*
This needs to read and write from my settings JSON file.
Need to export the settings. 
Need to export the write function. 
*/

import { readFile } from 'node:fs/promises';

async function getSettings(){
    try{
    const settings = JSON.parse(await readFile('./express/settings.json', {encoding: 'utf8'}));
    console.log('Got ', settings, ' from settings.json file.');
  } catch (error) {
    console.log('Error pulling settings: ', error.message);
  }
}


export const settings = getSettings();
