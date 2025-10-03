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