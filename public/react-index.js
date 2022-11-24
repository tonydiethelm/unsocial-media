/*What I need this to do...
    I need it to build a dom based on the contents of my hard drive. 
    I'll use a module to get the contents of my hard drive and return it as an object.
*/

//Make sure HTML is loading this. 
console.log('HTML is properly calling JS, and it is running.');

//setup stuff
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './style.css';
const startingDirectory = '/home/tony/Public';
const slash = '/'; //Need to fix some directories. :/
//const fs = require('fs');

//testing div, need to make sure this works at all. 
//Change render at bottom to Testing to see if it React is working. 
// const Testing = () => {
//     return <div>If you can see this, react is working. Yay!</div>
// };


/*PPPPP
What do I need? Let's map this out. 
Given available time, NOT going to set up Redux. :D


App
  Navigation  creates links
    Home
    Up
    Folders/links
  Display     creates pictures and text
  Pictures
    Picture
    Picture
  Text
    text
    text

What needs to be in state?
    I need the root directory.
    I need the directory to show.
    I do NOT need "up one directory". Can send .. to back end to get that. 
    I need  folders for navigation, pictures for pictures, text for text. 

app class with constructor, state, and click functions, navigation div, display div. 
navigation
links
display
picture
text

What's my data flow? 
Someone clicks on a button... 
does a get with target directory in request.body to backend... 
runs through middleware to get directory map...
comes back to react as reply, change state with it.


*/

class App extends Component {
    constructor(){
        super();     //Do I really need this? 
        this.state = {
            topDirectory: startingDirectory,
            directoryToShow: startingDirectory,
            folders: [],
            pictures: [],
            text: [],
            mapping: {},
        }
        //bind functions to this here.
        this.displayAFolder = this.displayAFolder.bind(this);

    }


    //Add a componentDidMount here with a fetch to /directory with the directoryToShow.
    //Will get directory mapping. Update state with that information. 
    //  My components will never change seperately. No need to put componentDidMounts inside individual elements. 
    //  Or will I have a race condition? Will the app load, make the call, and reload again? and again? and again? 
    //  further loads will NOT change the state, so won't rerender. Might cause uncessessary GET requests?
    //  Can put a "first load: true" to check before doing it if it's a problem. 
    componentDidMount() {
        fetch('/directory', {           //apparently no need for a hostname?
            method: 'POST',             //Annoys me that fetch won't do a GET with stuff in the request.body. Fine. Post it is. 
            body: JSON.stringify({targetDirectory: '/home/tony/Public'}),
            headers:{
                'Content-Type': 'application/json'
            },
        })
        .then(result => result.json())
        .then((data) => {
            this.setState({
                mapping: data,
                folders: data.directories,
                pictures: data.pictures,
                text: data.text,
            })
        })
        .then(() => console.log('We fetched our magic object, state is now...', this.state))
        .catch(error => console.log('We had an error getting the directory object...', error))
    }



    //Add functions here. 
    //Eventually, need to do another post when the user clicks on one of the buttons representing a folder. 
    //on a click, get the target directory and send a POST to /directory, update state with the response. 
    displayAFolder(targetDirectory) {
        console.log('Sending POST fetch for ', targetDirectory);
        fetch('/directory', {           //apparently no need for a hostname?
            method: 'POST',             //Annoys me that fetch won't do a GET with stuff in the request.body. Fine. Post it is. 
            body: JSON.stringify({targetDirectory: targetDirectory}),
            headers:{
                'Content-Type': 'application/json'
            },
        })
        .then(result => result.json())
        .then((data) => {
            this.setState({
                mapping: data,
                folders: data.directories,
                pictures: data.pictures,
                text: data.text,
                directoryToShow: targetDirectory,
            })
        })
        .then(() => console.log('We fetched our magic object, state is now...', this.state))
        .catch(error => console.log('We had an error getting the directory object...', error))
    }





    //render elements here. 
    render() {
        return(
            <div id="app">
                {console.log('Our state is...', this.state)}
                {console.log('Our directoryToShow is...', this.directoryToShow)}
                
                <div id="navigation">
                    <p>Navigation</p>
                    <Link
                        name = 'Home'
                        target={startingDirectory}
                        displayAFolder = {this.displayAFolder}
                    />
                    <Link
                        name = 'Go Up/Back'
                        target={this.state.directoryToShow + '/..'}
                        displayAFolder = {this.displayAFolder}
                    />
                    {this.state.folders.map((folderName, index) =>
                    (<Link
                        name = {folderName}
                        target={this.state.directoryToShow + slash + folderName}
                        displayAFolder = {this.displayAFolder}
                    />
                    ))}
                </div>
                
                <div id="display">
                    <h1>Welcome to Tony's Unsocial Media Page</h1>
                    <div id="aroundPictures">
                        {this.state.pictures.map((pictureName, index) =>
                            (<Picture
                                name = {pictureName}
                                target={pictureName}
                            />
                        ))}
                    </div>
                    {this.state.text.map((individualText, index) =>
                        (<Text
                            key = {index}
                            individualText={individualText}
                        />
                        ))}
                    
                </div>
            </div>
        )
    }

}


//Make elements that will need to be looped/copied here. Links, Pictures, Texts. 
class Link extends Component{
    render() {
        return(
            <div className="link">
                <button key = {this.props.name} className = 'same' onClick = {() => {this.props.displayAFolder(this.props.target)}}> 
                {this.props.name} 
                </button>
               
            </div>
        )
    }
}

class Picture extends Component{
    render() {
        return(
            <div className = "picture">
                <img src = {this.props.target} key = {this.props.name} className = 'same'></img>
            </div>
            )
    }
}


class Text extends Component{
    render() {
        return(
            <div className="text same" key = {this.props.index}> 
                <p>{this.props.individualText}</p>
            </div>
            )
    }
}




//Render to the dom. 
ReactDOM.render(<App />,document.getElementById('root'));
