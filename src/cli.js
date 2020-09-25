
const CONS = require('./constants.js')
const { printPalette } = require('./utils.js')
const imagePath = process.argv[2] || 'guitar.jpg'
const totalColors = process.argv[3] || CONS.totalColors
const writePath = process.argv[4] || 'palette.png'

printPalette(imagePath, totalColors, writePath)