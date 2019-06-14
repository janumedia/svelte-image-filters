//constanta
const maxValue = 255.0;

export const colors = (pixels, value) => {
    loop(pixels, (data, index) => {
        data[index]     *= value[0] / maxValue;
        data[index + 1] *= value[1] / maxValue;
        data[index + 2] *= value[2] / maxValue;
        data[index + 3] *= value[3] / maxValue;
    })
}

export const posterize = (pixels, value) => {
    value = Number(value);
    console.log('posterize', value);

    const numOfAreas = 256 / value;
    const numOfValues = 255 / (value - 1);

    loop(pixels, (data, index) => {
        // http://camanjs.com/docs/posterize.html
        data[index]     = Math.floor(Math.floor(data[index] / numOfAreas) * numOfValues);
        data[index + 1] = Math.floor(Math.floor(data[index + 1] / numOfAreas) * numOfValues);
        data[index + 2] = Math.floor(Math.floor(data[index + 2] / numOfAreas) * numOfValues);
    })
}

export const brightness = (pixels, value) => {
    value = Number(value);
    loop(pixels, (data, index) => {
        // https://www.dfstudios.co.uk/?page_id=436
        data[index]     += value;
        data[index + 1] += value;
        data[index + 2] += value;
    })
}

export const contrast = (pixels, value) => {
    value = Number(value);
    // http://thecryptmag.com/Online/56/imgproc_5.html
    const contrastFactor = (259 * (value + maxValue)) / (maxValue * (259 - value));
    loop(pixels, (data, index) => {
        data[index]     = truncate(contrastFactor * (data[index] - 128)      + 128);
        data[index + 1] = truncate(contrastFactor * (data[index + 1] - 128)  + 128);
        data[index + 2] = truncate(contrastFactor * (data[index + 2] - 128)  + 128);
    })
}

export const gamma = (pixels, value) => {
    // https://www.dfstudios.co.uk/?page_id=408
    const gammaCorrection = 1 / value;
    loop(pixels, (data, index) => {
        data[index]     = maxValue * Math.pow(data[index]     / maxValue, gammaCorrection);
        data[index + 1] = maxValue * Math.pow(data[index + 1] / maxValue, gammaCorrection);
        data[index + 2] = maxValue * Math.pow(data[index + 2] / maxValue, gammaCorrection); 
    }) 
}

export const temperature = (pixels, value) => {
    value = Number(value);
    // http://www.tannerhelland.com/5675/simple-algorithms-adjusting-image-temperature-tint/
    loop(pixels, (data, index) => {
        data[index]     += value;
        data[index + 2] -= value;
    })
}

export const tint = (pixels, value) => {
    value = Number(value);
    // http://www.tannerhelland.com/5675/simple-algorithms-adjusting-image-temperature-tint/
    loop(pixels, (data, index) => {
        data[index + 1] += value;
    })
}

export const saturation = (pixels, value) => {
    value = Number(value);
    // http://camanjs.com/docs/filters.html
    loop(pixels, (data, index) => {
        const r = data[index], g = data[index + 1], b = data[index + 2]; 
        const max = Math.max(r, g, b);

        if(r !== max) data[index    ] += (max - r) * -value;
        if(g !== max) data[index + 1] += (max - g) * -value;
        if(b !== max) data[index + 2] += (max - b) * -value;
    })
}

export const vibrance = (pixels, value) => {
    value = Number(value);
    //console.log('vibrance', value)
    // http://camanjs.com/docs/filters.html
    loop(pixels, (data, index) => {
        const r = data[index], g = data[index + 1], b = data[index + 2]; 
        const max = Math.max(r, g, b);
        const avg = (r + g + b) / 3;
        const amount = ((Math.abs(max - avg) * 2 / 255) * -value) / 100;
        
        if(r !== max) data[index    ] += (max - r) * amount;
        if(g !== max) data[index + 1] += (max - g) * amount;
        if(b !== max) data[index + 2] += (max - b) * amount;
    })
}

export const grayscale = (pixels, value) => {
    if(value == 0) return;

    // https://github.com/fabricjs/fabric.js/blob/master/src/filters/grayscale_filter.class.js
    // http://www.tannerhelland.com/3643/grayscale-image-algorithm-vb6/
    loop(pixels, (data, index) => {
        let grey, red = data[index], green = data[index + 1], blue = data[index + 2];

        // average
        if(value == 1) grey = (red + green + blue) / 3;
       
        // lightness
        // also know as decomposition
        // maximum decompostion <-- brighter
        else if(value == 2) grey = Math.max(red, green, blue);
        // minimum decompostion <-- use for artistic effect
        else if(value == 3) grey = Math.min(red, green, blue);
        // average decomposition
        else if(value == 4) grey = (Math.min(red, green, blue) + Math.max(red, green, blue)) * 0.5;

        // luminosity
        // by usig Luma formula <-- the best
        // https://en.wikipedia.org/wiki/Luma_(video)
        else if(value == 5) grey = 0.2126 * red + 0.7152 * green + 0.0722 * blue;
        // alternative Luma formula
        // https://www.dfstudios.co.uk/?page_id=445
        else if(value == 6) grey = 0.299 * red + 0.587 * green + 0.114 * blue;

        // single color
        // use red
        else if(value == 7) grey = red;
        // use green
        else if(value == 8) grey = green;
        // use blue
        else if(value == 9) grey = green;

        data[index]     = grey;
        data[index + 1] = grey;
        data[index + 2] = grey;
    });
}

export const shades = (pixels, value) => {
    if(value == 0) return;

    // http://www.tannerhelland.com/3643/grayscale-image-algorithm-vb6/
    const shadeNum  = Number(value);
    const factor    = 255 / (shadeNum - 1);
    
    loop(pixels, (data, index) => {
        const red = data[index], green = data[index + 1], blue = data[index + 2];
        const average = (red + green + blue) / 3;
        const grey = Math.round((average / factor) + 0.5) * factor; 

        data[index]     = grey;
        data[index + 1] = grey;
        data[index + 2] = grey;
    });
}

export const solarize = (pixels, value) => {
    // https://www.dfstudios.co.uk/?page_id=209
    const threshold = Math.abs(value);

    loop(pixels, (data, index) => {
        let red   = data[index];
        let green = data[index + 1];
        let blue  = data[index + 2];
        
        if(value > 0) {
            if(red > threshold)     red   ^= maxValue;
            if(green > threshold)   green ^= maxValue;
            if(blue > threshold)    blue  ^= maxValue;
        } else if (value < 0) {
            if(red < threshold)     red   ^= maxValue;
            if(green < threshold)   green ^= maxValue;
            if(blue < threshold)    blue  ^= maxValue;
        }

        data[index]     = red;
        data[index + 1] = green;
        data[index + 2] = blue;
    })
}

export const invert = (pixels, value) => {
    loop(pixels, (data, index) => {
        // https://css-tricks.com/manipulating-pixels-using-canvas/#article-header-id-4
        data[index]     ^= value;
        data[index + 1] ^= value;
        data[index + 2] ^= value;
    })
}

export const nearest = (pixels, value) => {
    if(value == 0) return;

    let factor = 9 - Number(value);

    loop(pixels, (data, index) => {
        // https://www.dfstudios.co.uk/?page_id=484
        data[index]     = colorQuantization(data[index], factor);
        data[index + 1] = colorQuantization(data[index + 1], factor);
        data[index + 2] = colorQuantization(data[index + 2], factor);
    })
}

export const threshold = (pixels, value) => {

    if(value == 0) return;

    const {data} = pixels;
    
    for(let i = 0, len = data.length ; i < len ; i++) {
        let color = data[i] <= value ? 0 : 255;
        data[i] = color;
    }
}

export const halftone = (pixels, value) => {

    if(value == 0) return;

    const {width, data} = pixels;

    // 4 x 4 Bayer matrix
    // https://en.wikipedia.org/wiki/Ordered_dithering
    const bayerMatrix = [
        [ 0,  8,  2, 10],
        [12,  4, 14,  6],
        [ 3, 11,  1,  9],
        [15,  7, 13,  5]
    ];
    const thresholdMap = (x, y, color) => {
        const map = Math.floor((color + bayerMatrix[x % 4][y % 4] * 16) * 0.5);
        return map <= value ? 0 : 255;
    }

    // https://stackoverflow.com/q/12422407/1578100
    for(let i = 0, len = data.length ; i < len ; i+=4) {
        const x = i * 0.25 % width;
        const y = Math.floor(i * 0.25 / width);
        
        data[i]     = thresholdMap(x, y, data[i]);
        data[i + 1] = thresholdMap(x, y, data[i + 1]);
        data[i + 2] = thresholdMap(x, y, data[i + 2]);
    }
}

export const dithering5 = (pixels, value) => {

    if(value == 0) return;

    const {width, data} = pixels;
    
    // https://stackoverflow.com/q/12422407/1578100
    for(let i = 0, len = data.length ; i < len ; i++) {
        let color    = data[i];
        let newColor = color <= 128 ? 0 : 255;
        let err      = Math.floor((color - newColor) / 8);

        data[i] = newColor;

        data[i + 4            ] += err;
        data[i + 8            ] += err;
        data[i + 4 * width - 4] += err;
        data[i + 4 * width    ] += err;
        data[i + 4 * width + 4] += err;
        data[i + 8 * width    ] += err;
    }
}

export const dithering4 = (pixels, value) => {

    if(value == 0) return;

    const {width, data} = pixels;
    
    // https://stackoverflow.com/q/12422407/1578100
    for(let i = 0, len = data.length ; i < len ; i++) {
        let color    = data[i];
        let newColor = color <= 128 ? 0 : 255;
        let err      = Math.floor((color - newColor) / 16);

        data[i] = newColor;

        data[i + 4            ] += err * 7;
        data[i + 4 * width - 4] += err * 3;
        data[i + 4 * width    ] += err * 5;
        data[i + 4 * width + 4] += err * 1;
    }
}

export const dithering3 = (pixels) => {

    // https://stackoverflow.com/a/40791652/1578100
    // https://github.com/gabrielarchanjo/marvinproject/blob/master/marvinproject/dev/MarvinPlugins/src/org/marvinproject/image/halftone/dithering/Dithering.java
    const DOT_AREA     = 4;
    const DOT_AREA_SQR = Math.pow(DOT_AREA, 2);
    /*const arrDither = [
        167,200,230,216,181,
        94,72,193,242,232,
        36,52,222,167,200,
        181,126,210,94,72,
        232,153,111,36,52
    ]*/

    const {width, height, data} = pixels;

    //grayscale(pixels, 4);

    const index = (x, y) => (x + width * y) * 4;

    for(let x = 0 ; x < width ; x+=DOT_AREA) {
        for(let y = 0 ; y < height ; y+=DOT_AREA) {
            for(let a = 0 ; a < DOT_AREA_SQR ; a++) {
                let xn = a % DOT_AREA;
                let yn = a / DOT_AREA;
                
                if(x + xn < width && y + yn < height) {
                    let i = index(x, y);// + xn, y + yn);
                    let r = data[i];// >= 255 ?  255 : 0;
                    let g = data[i + 1];// >= 255 ?  255 : 0;
                    let b = data[i + 2];// >= 255 ?  255 : 0;

                    data[i] = r > 128 ? 255 : 0;
                    data[i + 1] = g > 128 ? 255 : 0;
                    data[i + 2] = b >= 128 ? 255 : 0;

                    data[i] ^= 255;
                    data[i + 1] ^= 255;
                    data[i + 2] ^= 255;

                }
            }
        }
    }
}

export const dithering = (pixels, value) => {

    if(value == 0) return;

    const {width, height, data} = pixels;

    //grayscale(pixels, factor);
    
    const index = (x, y) => (x + width * y) * 4;
    const applyError = (x, y, factor) => {
        let i = index(x, y);
        data[i] = data[i] + errR * factor;
        data[i + 1] = data[i + 1] + errG * factor;
        data[i + 2] = data[i + 2] + errB * factor;
    }

    let errR, errG, errB;

    let factor = 9 - Number(value);
    let d = 16.0, t1 = 7 / d, t2 = 3 / d, t3 = 5 / d, t4 = 1 / d;

    // https://en.wikipedia.org/wiki/Floyd%E2%80%93Steinberg_dithering
    // https://www.dfstudios.co.uk/?page_id=460
    for(let y = 1 ; y < height - 1 ; y++) {
        for(let x = 1 ; x < width - 1 ; x++) {
            let i = index(x, y);

            let r = data[i];
            let g = data[i + 1];
            let b = data[i + 2];

            let newR = colorQuantization(r, factor);
            let newG = colorQuantization(g, factor);
            let newB = colorQuantization(b, factor);

            errR = r - newR;
            errG = g - newG;
            errB = b - newB;

            data[i]     = newR;
            data[i + 1] = newG;
            data[i + 2] = newB;

            applyError(x + 1, y    , t1);
            applyError(x - 1, y + 1, t2);
            applyError(x    , y + 1, t3);
            applyError(x + 1, y + 1, t4);
        }
    }
}

export const dithering1 = (pixels, value) => {

    if(value == 0) return;

    const {width, height, data} = pixels;
    
    const index = (x, y) => (x + width * y) * 4;
    const applyError = (x, y, factor) => {
        let i = index(x, y);
        data[i] = data[i] + errR * factor;
        data[i + 1] = data[i + 1] + errG * factor;
        data[i + 2] = data[i + 2] + errB * factor;
    }

    let errR, errG, errB;

    // https://en.wikipedia.org/wiki/Floyd%E2%80%93Steinberg_dithering
    for(let y = 0 ; y < height ; y++) {
        for(let x = 0 ; x < width ; x++) {
            let i = index(x, y);
            
            let newPixel = findNearestColour([data[i], data[i + 1], data[i + 2]]);

            errR = data[i] - newPixel[0];
            errG = data[i + 1] - newPixel[1];
            errB = data[i + 2] - newPixel[2];

            data[i] = newPixel[0];
            data[i + 1] = newPixel[1];
            data[i + 2] = newPixel[2];

            applyError(x + 1, y    , 7 / 16);
            applyError(x - 1, y + 1, 3 / 16);
            applyError(x    , y + 1, 5 / 16);
            applyError(x + 1, y + 1, 1 / 16);
        }
    }
}

export const highpass = (pixels, value) => {
    
    value = Number(value);
    if(value == 0) return;
    
    let a = 0 - value;
    let b = value * 12;

    // using Laplace filter
    // https://en.wikipedia.org/wiki/Discrete_Laplace_operator#Implementation_in_Image_Processing

    const operator  = [
        [ a,   1 + 2 * a, a  ],
        [1 + 2 * a,  -4 + b,  1 + 2 * a],
        [ a,   1 + 2 * a, a  ]                     
    ];

    pixels.data.set(convolution(pixels, operator));
}

export const sharpen = (pixels, value) => {
    value = Number(value);
    if(value == 0) return;
    
    // https://gist.github.com/mikecao/65d9fc92dc7197cb8a7c
    // https://www.codingame.com/playgrounds/2524/basic-image-manipulation/filtering

    let a = 0.1 - value;
    let b = value * 4;

    const operator  = [
        [ a,   -0.5, a  ],
        [-0.5,  2.6 + b,  -0.5],
        [ a,   -0.5, a  ]                     
    ];

    pixels.data.set(convolution(pixels, operator));
};


export const sobel = (pixels, value) => {
    
    if(value == 0) return;

    // sobel filter
    // https://en.wikipedia.org/wiki/Sobel_filter
    // https://github.com/miguelmota/sobel/blob/master/sobel.js

    const operatorY = [
        [-1, -2, -1],
        [ 0,  0,  0],
        [ 1,  2,  1]
    ];
    
    const operatorX = [
        [-1, 0, 1],
        [-2, 0, 2],
        [-1, 0, 1]
    ]
    
    // https://www.html5rocks.com/en/tutorials/canvas/imagefilters/
    
    let vertical   = convolution(pixels, operatorY);
    let horizontal = convolution(pixels, operatorX);
    
    let output = [];
    for(let i = 0, len = pixels.data.length ; i < len ; i+=4) {
        
        let v = Math.abs(vertical[i]);
        let h = Math.abs(horizontal[i]);
        output[i]     = v;
        output[i + 1] = h;
        output[i + 2] = (v + h) / 4;
        output[i + 3] = pixels.data[i + 3];
    }

    pixels.data.set(output);
    
    // set grayscale
    grayscale(pixels, value);
}

//utils
const findNearestColour = color => {
    const pureColors = {
        black   : [0, 0, 0],
        red     : [255, 0, 0],
        green   : [0, 255, 0],
        yellow  : [255, 255, 0],
        blue    : [0, 0, 255],
        magenta : [255, 0, 255],
        cyan    : [0, 255, 255],
        white   : [255, 255, 255]
    }

    // https://www.dfstudios.co.uk/?page_id=484
    let minimumDistance = Math.pow(maxValue, 2) + Math.pow(maxValue, 2) + Math.pow(maxValue, 2) + 1; 
    let nearestColor = color;
    Object.keys(pureColors).map(key => {
      let pure = pureColors[key];
      let distance = Math.pow(pure[0] - color[0], 2) + Math.pow(pure[1] - color[1], 2) + Math.pow(pure[2] - color[2], 2);

      if(distance < minimumDistance) {
        minimumDistance = distance;
        nearestColor = pure;
      }
    });
    return nearestColor;
}

const colorQuantization = (color, factor) => {
    // https://www.youtube.com/watch?v=0L2n8Tg2FwI

    return Math.round(factor * color / 255) * (255 / factor);
}

const loop = (pixels, filterFN) => {
    for(let i = 0, total = pixels.data.length ; i < total ; i += 4) {
        filterFN(pixels.data, i);
    }
}

const convolution = (pixels, weights) => {
    
    const {width, height, data} = pixels;
    const sides = weights.length;
    const halfSides = Math.floor(sides * 0.5);

    const outputData = !window.Float32Array ? [] : new Float32Array(width * height * 4);
    for(let y = 0 ; y < height ; y++) {
        for(let x = 0 ; x < width ; x++) {
            let index = (y * width + x) * 4;
            let red = 0, green = 0, blue = 0;

            for(let kernelY = 0; kernelY < sides; kernelY++) {
                for(let kernelX = 0 ; kernelX < sides; kernelX++) {
                    let currentKernelX = x + kernelX - halfSides;
                    let currentKernelY = y + kernelY - halfSides;

                    if (currentKernelY >= 0 &&
                        currentKernelY <  height &&
                        currentKernelX >= 0 &&
                        currentKernelX <  width
                    ) {
                        const offset = (currentKernelY * width + currentKernelX) * 4;
                        const weight = weights[kernelY][kernelX];

                        red   += data[offset]     * weight;
                        green += data[offset + 1] * weight;
                        blue  += data[offset + 2] * weight;
                    }
                }
            }

            outputData[index]     = red;
            outputData[index + 1] = green;
            outputData[index + 2] = blue;
            outputData[index + 3] = data[index + 3];
        }
    }
    return outputData;
}

const truncate = value => {
    if(value < 0) return 0;
    if(value > maxValue) return maxValue;
    return value;
}