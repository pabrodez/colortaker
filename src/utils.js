const _ = require('lodash')
const Jimp = require('jimp')
const path = require('path')
const CONS = require('./constants')

function printPalette(inputPath, totalColors, outputPath) {
    Jimp.read(inputPath)
        .then(img => {
            const nSplits = Math.log(totalColors) / Math.log(2)
            let pixelsArray =  []
            img.scan(0, 0, img.bitmap.width, img.bitmap.height, function (x, y, ind) {
                let arrString = JSON.stringify({
                    'red': this.bitmap.data[ind],
                    'green': this.bitmap.data[ind + 1],
                    'blue': this.bitmap.data[ind + 2]
                })
                if (CONS.colorsToExclude.indexOf(arrString) < 0) pixelsArray.push(JSON.parse(arrString))
            })
            let buckets = [pixelsArray] // create an array of buckets, a bucket is an array of pixel objects
            const averageBucketRgb =  runMedianCut(buckets, 1, nSplits)
            console.log(averageBucketRgb.reduce((a, b) => a + "\n" + rgbArrayToString(b), ""))
            const palettePixels =  createRepeatedRgbaArray(400, totalColors * 200, averageBucketRgb)
            writeImage(400, totalColors * 200, palettePixels, outputPath)
        })
        .catch(err => console.log(err))
}

function rgbArrayToString(rgbArray) {
    return `RGB(${rgbArray[0]}, ${rgbArray[1]}, ${rgbArray[2]})`
}

function writeImage(width = 400, height = 400, rgbArray, outPath) {
    new Jimp(width, height, (err, img) => {
        if (err) throw new Error(err)
        img.bitmap.data = rgbArray
        img.write(outPath, () => console.log(`Saved in ${path.resolve(__dirname, outPath)}`))
    })
}

function createRepeatedRgbaArray(imageWidth, imageHeight, bucketsRgbAvg) {
    // bucketsRgbAvg is an array of arrays each containing the rgb average of buckets
    // would be assigned to a created image (image.bitmap.data = outArray)
    let outArray = []
    bucketsRgbAvg.forEach(buck => {
        outArray.push(
            Array(imageWidth * (imageHeight / bucketsRgbAvg.length))
                .fill(buck.concat(255))
        )
    })

    return outArray.flat(2)
}

function getMapOfOccurences(arr, valuesToIgnore) {
    // takes an Array of values and returns a Map with those values as keys and values as n occurences
    // valuesToIgnore = array of rgba values we want to ignore (transparent colors for example)
    return (
        arr.reduce((acc, curr) => {
            if (valuesToIgnore.indexOf(curr) > -1) {
                return acc
            } else {
                return acc.has(curr) ? acc.set(curr, acc.get(curr) + 1) : acc.set(curr, 1)
            }
        }, new Map())
    )
}

function runMedianCut(buckets, iteration, maxIterations) {
    if (iteration > maxIterations) {
        return buckets.map(buck => getRgbAverageOfPixels(buck))
    }
    let splitBuckets = []
    buckets.forEach(buck => {
        let largestChannel = findLargesChannelRange(buck)
        let med = median(largestChannel.values)
        let bottomUpperHalf = splitAtDimValue(buck, largestChannel.name, med)
        splitBuckets.push(...bottomUpperHalf)
    })

    return runMedianCut(splitBuckets, iteration + 1, maxIterations)
}

function findLargesChannelRange(arr) {
    // Step 2 and 3
    // arr is an Array of pixel objects containing red, green and blue values
    // returns and array with name of largest range dimension  and array of its values 
    let channelValues = {
        'red': [],
        'green': [],
        'blue': []
    }
    _.forEach(arr, e => {
        channelValues['red'].push(e['red'])
        channelValues['green'].push(e['green'])
        channelValues['blue'].push(e['blue'])
    })
    let channelRanges = {
        'red': _.max(channelValues['red']) - _.min(channelValues['red']),
        'green': _.max(channelValues['green']) - _.min(channelValues['green']),
        'blue': _.max(channelValues['blue']) - _.min(channelValues['blue'])
    }
    let channelName = Object.entries(channelRanges).sort((a, b) => b[1] - a[1])[0][0]

    return {
        name: channelName,
        values: channelValues[channelName]
    }
}

function median(arr) {
    // Step 4
    // takes an array un values of a dimension and returns its median
    const mid = Math.floor(arr.length / 2)
    const sortedVals = [...arr].sort((a, b) => a - b)
    return mid % 2 !== 0 ? sortedVals[mid] : ((sortedVals[mid - 1] + sortedVals[mid]) / 2)
}

function splitAtDimValue(arr, dimName, dimVal) {
    // Step 5
    // takes array of pixels objects with rgb values and splits them in two: 
    // one below the median of largest and one above
    // returns array of two arrays: upper and bottom halves

    let firstHalf = []
    let secondHalf = []
    _.forEach(arr, pix => {
        if (pix[dimName] < dimVal) {
            firstHalf.push(pix)
        } else { secondHalf.push(pix) }
    })

    return [firstHalf, secondHalf]
}

function getRgbAverageOfPixels(arr) {
    // Step 7
    // arr is an array/bucket of pixel objects with rgb values
    // returns an array with the "average" rgb channels in the bucket
    return arr.reduce((prev, curr) => {
        prev[0] += curr['red']
        prev[1] += curr['green']
        prev[2] += curr['blue']
        return prev
    }, [0, 0, 0]).map(channelSum => Math.floor(channelSum / arr.length))

}


module.exports = {
    createRepeatedRgbaArray,
    runMedianCut,
    writeImage,
    printPalette
}