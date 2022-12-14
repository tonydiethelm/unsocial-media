/* What this needs to do:
I need to static serve my HTML, JS, CSS.
I need to static serve imeges from the target directory (see README).
I need to static serve a settings page.

I need to respond to GETs with parameters to /api/directory. 

I need to handle wrong URIs.
I need to handle errors.
Actually call the HTTP server.

*/



//set up everything
//get settings from settings.json
import settings from './settings.json' assert {type: 'json'};
//express set up
import express from 'express';
const app = express();
//automatically destring incoming JSON
app.use(express.json());
//import my middleware/controllers
import mapMyDirectory from './mapMyDirectory.mjs';
//extra stuff
import holler from '@tonydiethelm/holler';



//Express routes and static serves
//static serves
//HTML, CSS, JS, settings.html
//get file path URL object
const publicDirectory = new URL('../public', import.meta.url); 
app.use('/', 
// holler, 
express.static('public'));
console.log('starting static serve of ', publicDirectory.pathname);

//serve up pictures
app.use('/api/assets', 
// holler, 
express.static(settings.targetDirectory));
console.log('starting static serve of ', settings.targetDirectory);




//handle requests to directory api
app.get('/api/directory/',
holler,
mapMyDirectory,
holler,
(request, response) => {response.status(200).send(response.locals.mapping)}
);




//handle wrong URIs
app.use('*', 
  (request, response) => {
    response.status(404).json('Sorry, we don\'t have that here.')
});

//handle errors
//ToDo


//Call the HTTP server 
app.listen(settings.port, () => {
  console.log('Server listening on port: ' + settings.port);
 });