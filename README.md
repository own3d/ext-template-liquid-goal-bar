# Vue 3 + Vite + OWN3D Extension Helper

This template should help get you started developing with Vue 3 in Vite with our Extension Helper. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Extension Helper

The Extension Helper is a small library that helps you to create extensions for OWN3D. It provides a set of helper functions and a set of OWN3D API functions that you can use in your extensions.

## Hosted Example

The built version of this template is hosted on our Extension CDN. You can find it [here](https://81540cfe-ef92-459a-8f95-c035bc0b3be3.ext-own3d.tv/0.0.0/index.html).

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).


## HOW TO: FILLBAR CALCULATION

get the path from the delivered svg and convert it https://yoksel.github.io/relative-clip-path/

create file "fill-clip.svg"  like this and paste the code from "objectboundingbox" into the d attribute from path tag

<svg>
    <clipPath clipPathUnits="objectBoundingBox">
        <path d="M0.502,1 C0.046,0.742,0,0.396,0,0.337 S0.056,0.001,0.25,0.001 S0.502,0.157,0.502,0.157 C0.502,0.157,0.6,-0.001,0.765,0 S1,0.238,1,0.313 S0.892,0.763,0.502,1" />
    </clipPath>
</svg>


## goalbar.styles.ts
## calculation of the fillPadding Attribute
(500 is the correct dimension of the svg and we need the padding from the foreground.png to the fill-clip.svg line)
You will get coordinates from Andy

//top: 0.255, =(127,5/500)
//right: 0.177, = (411,5/500) - 1
//bottom: 0.162967, = ((418,5165/500) -1)  *  -1
//left: 0.175, = ((87,5/500) -1)  *  -1

