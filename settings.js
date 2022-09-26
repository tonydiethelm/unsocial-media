/* I need to make a configuration page
I need...
Folder to watch
What Port to run on? (80 is default)
Style dropdown. 

*/






/* Testing and notes
summary and form elements provided by html file. Put the following in the form. 
  input, folder to watch
  input, port to run on
  select, options for different CSS stylesheets.
  submit

Pseudocode...
get the form element
make the above elements.
  select options will have to be made by scanning this directory for CSS files. 
insert them to the form. 
*/
import DirectoryContents from "./mapAFolder";
const path = require('node:path');



//Get the form for later appending.
const form = document.getElementById('settings');

//Create the input for what folder to watch.
let folder = document.createElement('input');
folder.innerHTML = 'What folder/directory do you want Unsocial Media to watch for pictures, text, etc?';
folder.type = 'text';
folder.id = 'folder';
form.append(folder);

//Create the input for what port to use.
let port = document.createElement('input');
port.innerHTML = 'What port should the server run on? The default of 80 is fine for most people.';
port.type = 'text';
port.id = 'port';
port.value = 80;
form.append(port);

//Create a dropdown menu for what CSS style sheet to use. 
let style = document.createElement('select');
style.type = 'text';
style.id = 'style';
form.append(style);

//Create the options for the style selector. 
const availableStyles = new DirectoryContents(__dirname).listCss;

for(let styles of availableStyles){
  console.log('available styles are: ', styles);
}
// let option = document.createElement('input');
// folder.innerHTML = 'What folder/directory do you want Unsocial Media to watch for pictures, text, etc?';
// folder.type = 'text';
// folder.id = 'folder';
// form.append(folder);


//form.append();

