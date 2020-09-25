1. Take an array of arrays containing RGB of each pixel ([[red, blue, green], [red, blue, green], etc])
2. Find the range of values for each of the three color channel accross pixels in the array
3. Take the channel with largest range
4. Find the median value for that channel
5. Split the pixels in array in two: below the median of that channel and above it
6. Repeat recursevily until we get N groups
7. Get average of each group

The number of colors desired needs to be a power of two. The number of times we are going perform a split of pixels would be = log(colors in palette) / log(2)

```bash
npm install colortaker && npm run getPalette --- gibson.jpg 4 palette.png
```

```bash
npm install colortaker
```
```javascript
const {printPalette} = require('colortaker')
printPalette('guitar.jpg', 4, 'palette.png')
```