# 🎨 colortaker 🖼️ ➡️ 🖌️🎨

Take an image and print a palette with the most prominent colors.

<table>
<thead>
<tr>
<th align="center">Image</th>
<th align="center">Palette</th>
</tr>
</thead>
<tbody>
<tr>
<td style="width: 40%;" align="center"><img src="./guitar.jpg" alt="guitar" style="max-width:100%;" width="30%"></td>
<td style="width: 40%;" align="center"><img src="./palette.png" alt="palette" style="max-width:100%;" width="40%"></td>
</tr>
</tbody>
</table>

### Install and use the command line
```bash 
git clone https://github.com/pabrodez/colortaker
cd colortake
npm install
```

The command takes the arguments: path of your pic, the number of colors in the palette and the palette destination name

For example:
```bash
npm run getPalette --- gibson.jpg 4 palette.png
```
Will give you the example palette.

### Or use the module

```bash
npm install colortaker
```

```javascript
const {printPalette} = require('colortaker')
printPalette('guitar.jpg', 4, 'palette.png')
```

### The [Median cut](https://en.wikipedia.org/wiki/Median_cut) algorithm was implemented as follows:
1. Take an array of objects containing RGB of each pixel
2. Find the range of values for each of the three color channel accross pixels in the array
3. Take the channel with largest range
4. Find the median value for that channel
5. Split the pixels in array in two: below the median of that channel and above it
6. Repeat recursevily until we get N groups
7. Get average of each group

### Credits to:
 - <span>Guitar photo by <a href="https://unsplash.com/@copal?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">CÔPAL</a> on <a href="https://unsplash.com/s/photos/guitar-gibson?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText">Unsplash</a></span>