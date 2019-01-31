# [images-player-with-timer](https://github.com/peshrus/images-player-with-timer)

It's a React component to display a set of images in a player having a timer.

## Demo
[CodeSandbox](https://codesandbox.io/s/2pqyk364pj)

## Installation
Using npm:
```
$ npm i -g npm
$ npm i --save images-player-with-timer
```

## Properties
- **images (required)**: an array of objects 
```
{
  src, // required, URL of the image
  author, // optional, author of the image
  savedFrom // required, website where the image is taken from
}
```
- **brandText (required)**: the text, shown in the bottom left corner
- maxTimeSec: time in seconds to show each image from the array, **default is 120**
- width: the width of the component, **default is 100vw**
- height: the height of the component, **default is 100vh**
- primaryColor: the main color used in the component, **default is black**
- secondaryColor: the secondary color used in the component, **default is white**
- accentColor: the accent color used in the component, **default is yellow**
- inactiveColor: the color of inactive parts used in the component, **default is lightgrey**
- onCloseClick: the function to handle close icon clicks, **default is `() => console.log("Close Clicked")`**
- onStarClick: the function to handle star icon clicks, **default is `() => console.log("Star Clicked")`**


## Thanks
https://medium.com/quick-code/publish-your-own-react-component-as-npm-package-under-5-minutes-8a47f0cb92b9