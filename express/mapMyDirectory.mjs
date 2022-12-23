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
    const mapping =  new mapObject(targetDirectory);

    //put it on the response to return to client. 
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
          this.text.push(textToParagraphs(`${directory}/${item}`));
        //pictures
        //Needs to return pathnames without the starting directory. 
        }else if(isPicture(item)){
          this.pictures.push(directory.replace(settings.targetDirectory, "/api/assets/") + item);
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

function textToHTML(itemWithDirectory){
  //I want to read the item at directory.
  //I want to append a <p> tag. 
  //I want to replace /\r?\n/g with <p>
  //return the whole string as one thing. 

  let stringToReturn = "<p>";
  const text = fs.readFileSync(itemWithDirectory, 'utf8');
  stringToReturn += text.replace(/\n/g, "<p>");
  console.log('text is...', text);
  console.log('string now is...', stringToReturn);
  return stringToReturn;
};

function textToParagraphs(itemWithDirectory){
  const text = fs.readFileSync(itemWithDirectory, 'utf8');
  return text.split(/\n/);
}



export default mapMyDirectory