/*
What I need...
I need a middleware to... 
    get the requested directory from the request body.
    run that through getDirectyContents to get a properly formatted object.
    return that to the server running react so it can make the UI. 

How is the directory path going to be sent in?
    Object?   {targetDirectory: "~/blah/blah/blah"}
      Can't use with GET, have to use POST. 
    params?   params only send ONE thing, could do a folder name, but... 
      requires us to not be RESTful... Has to keep track of where you are. 
      That'll get confused with multiple users. Nope. 
    Queries? 
      Can send whole string, works fine. Use those. 

*/


//setup stuff
import fs from 'node:fs';
//Need the module to create the object. 
import mapObject from './lsDirAndBuildMapObject.mjs';



const mapMyDirectory = (request, response, next) => {
  console.log('mapping directory');
  // console.log('starting directory is...', settings.startingDirectory)
    //get requested directory
    const targetDirectory = request.query.targetDirectory;
    //console.log(targetDirectory, typeof targetDirectory);
    //run it through the module
    const mapping = new mapObject(targetDirectory);
    //send it onward through response.locals.mapping, as dictated by route in express-index.js
    //testing
    //console.log('mapping is...', mapping);
    response.locals.mapping = mapping;
    return next();
  }






export default mapMyDirectory