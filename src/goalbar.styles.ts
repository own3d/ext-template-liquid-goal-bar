import { GoalbarStyle } from './types';

// for now we only support 1 style at a time, but the goal is to be able to generate multiple styles within one extension

export const goalbarStyles: Record<string, GoalbarStyle> = {
  default:{
    fillClipPath: '/default/fill-clip.svg',
    fillPadding: {
      top: 0.1702,
      right: 0.1494,
      bottom: 0.0604,
      left: 0.149,
    },
    foregroundMedia: '/default/foreground.png',
    overlayMedia: '/default/overlay.webm',
    completionMedia: '/default/completion.webm',
    eventMedia: '/default/event.webm',
    replaceOverlayWithCompletion: true,
  },
  /*
  // Halloween
  pumpkin: {
    fillClipPath: '/halloween/pumpkin/fill-clip.svg',
    fillPadding: {
      top: 0.252,
      right: 0.082,
      bottom: 0.0706,
      left: 0.078,
    },
    foregroundMedia: '/halloween/pumpkin/foreground.png',
    overlayMedia: '/halloween/pumpkin/overlay.webm',
    completionMedia: '/halloween/pumpkin/completion.webm',
    eventMedia: '/halloween/pumpkin/event.webm',
    replaceOverlayWithCompletion: true,
  },
  poison: {
    fillClipPath: '/halloween/poison/fill-clip.svg',
    fillPadding: {
      top: 0.1522,
      right: 0.274,
      bottom: 0.037,
      left: 0.2754,
    },
    foregroundMedia: '/halloween/poison/foreground.png',
    overlayMedia: '/halloween/poison/overlay.png',
  },
  boiler: {
    fillClipPath: '/halloween/boiler/fill-clip.svg',
    fillPadding: {
      top: 0.1702,
      right: 0.1494,
      bottom: 0.0604,
      left: 0.149,
    },
    foregroundMedia: '/halloween/boiler/foreground.png',
    overlayMedia: '/halloween/boiler/overlay.webm',
    completionMedia: '/halloween/boiler/completion.webm',
    eventMedia: '/halloween/boiler/event.webm',
    replaceOverlayWithCompletion: true,
  },

  // Christmas
  christmas_hat: {
    fillClipPath: '/christmas/hat/fill-clip.svg',
    fillPadding: {
      top: 0.058,
      right: 0.092,
      bottom: 0.265,
      left: 0.144,
    },
    foregroundMedia: '/christmas/hat/foreground.png',
    overlayMedia: '/christmas/hat/overlay.webm',
    completionMedia: '/christmas/hat/completion.webm',
    eventMedia: '/christmas/hat/event.webm',
    replaceOverlayWithCompletion: true,
  },
  christmas_tree: {
    fillClipPath: '/christmas/tree/fill-clip.svg',
    fillPadding: {
      top: 0.2,
      right: 0.185,
      bottom: 0.034,
      left: 0.197,
    },
    foregroundMedia: '/christmas/tree/foreground.png',
    overlayMedia: '/christmas/tree/overlay.webm',
    completionMedia: '/christmas/tree/completion.webm',
    eventMedia: '/christmas/tree/event.webm',
    replaceOverlayWithCompletion: true,
  },
  christmas_snowman: {
    fillClipPath: '/christmas/snowman/fill-clip.svg',
    fillPadding: {
      top: 0.3208,
      right: 0.2176,
      bottom: 0.0394,
      left: 0.2204,
    },
    foregroundMedia: '/christmas/snowman/foreground.png',
    overlayMedia: '/christmas/snowman/overlay.webm',
    completionMedia: '/christmas/snowman/completion.webm',
    eventMedia: '/christmas/snowman/event.webm',
    replaceOverlayWithCompletion: true,
  },
 valentine_heart: {
    fillClipPath: '/valentine/heart/fill-clip.svg', //please use the svg without 500x500x dimensions !
    fillPadding: {
      top: 0.255,
      right: 0.177,
      bottom: 0.162967,
      left: 0.175,
    },
    foregroundMedia: 'valentine/heart/foreground.png',
    overlayMedia: 'valentine/heart/overlay.webm',
    completionMedia: 'valentine/heart/completion.webm',
    eventMedia: 'valentine/heart/event.webm',
    replaceOverlayWithCompletion: true,
  },*/
}

// please ask for the padding coordinates. You will get pixel values like this:
/*

Top
X
Y 127,5

Right
X 411,5
Y

Bottom
X
Y 418,5165 

Left
X 87,5 
Y
*/

//you have to divide all coordindates with 500. 

 
//top: 0.255, =(127,5/500)
//right: 0.177, = (411,5/500) - 1
//bottom: 0.162967, = ((418,5165/500) -1)  *  -1
//left: 0.175, = ((87,5/500) 