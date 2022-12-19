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
//import mapObject from './lsDirAndBuildMapObject.mjs';
//get settings from settings.json
import settings from './settings.json' assert {type: 'json'};


const mapMyDirectory = (request, response, next) => {
  console.log('mapping directory');

  //get requested directory
    const targetDirectory = request.query.targetDirectory;

    //run it through the module
    const mapping = new mapObject(targetDirectory);
    //send it onward through response.locals.mapping, as dictated by route in express-index.js
    //testing
    //console.log('mapping is...', mapping);
    response.locals.mapping = mapping;
    return next();
}

class mapObject {
  constructor(directory){
      this.directories = [];
      this.pictures = [];
      this.text = [];
      this.other = [];
      this.css = [];
      this.fillTheContents(directory);
  }

  fillTheContents(directory){ //scans directory and sorts into directories, pictures, texts, and Others.
  
    console.log("checking that I have access to settings...", settings.targetDirectory);
    console.log('scanning HD, creating object');

    const arrayOfDirectoryContents = fs.readdirSync(directory);
    //handle directories
    for(const item of arrayOfDirectoryContents){
      if(isDirectory(`${directory}/${item}`)){
        this.directories.push(item);
      }
      //handle files
      if(isFile(`${directory}/${item}`)){
        //text
        if(isText(item)){
          this.text.push(item);
        //pictures
        //Needs to return pathnames without the starting directory. 
        }else if(isPicture(item)){
          console.log('Directory is... ', directory, typeof directory, directory.length);
          console.log('settings.targetdirectory is...', settings.targetDirectory, typeof settings.targetDirectory, settings.targetDirectory.length);
          console.log(directory.replace(settings.targetDirectory, "Why not?"));
          this.pictures.push(directory.replace(settings.targetDirectory, "/api/assets/") + "/" + item);
        //CSS
        }else if(isCSS(item)){
          this.css.push(item);
        //Other
        }else{
          this.other.push(item);
        }
      }
    }
  }
}

function isFile(path){
  return fs.statSync(path).isFile();
}

function isDirectory(path){
  return fs.statSync(path).isDirectory();
}

function isCSS(item){
  return item.endsWith('.css');
}

function isPicture(item){
  return item.endsWith('.jpg') || item.endsWith('.jpeg') || item.endsWith('.png');
}

function isText(item){
  return item.endsWith('.txt') || item.endsWith('.text');
}


export default mapMyDirectory