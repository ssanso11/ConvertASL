var rgbArrToHsv = function(rgb) {
    // console.log(rgb)
    var [r, g, b] = rgb;
    r /= 255;
    g /= 255;
    b /= 255;

    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, v = max;

    var d = max - min;
    var s = max == 0 ? 0 : d / max;

    if (max == min) {
        h = 0; 
    } else {
        switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        }

        h /= 6;
    }
    return [h*360,s*100,v*100];
}
    
export var arrRgbMap = function(arr) {
    return arr.map(rgbArrToHsv)
}

var arrMaskSat = function(hsv, h_l, h_h, s_l, s_h, v_l, v_h) {
    var [h, s, v] = hsv;
    if (h > h_l && h < h_h
        && s > s_l && s < s_h
        && v > v_l && v < v_h) {
        return [h,s,100]; // hsv white
    }
    return [h,s,0]; // hsv black
}

export var arrMaskMap = function(arr, h_l, h_h, s_l, s_h, v_l, v_h) {
    return arr.map(x => arrMaskSat(x, h_l, h_h, s_l, s_h, v_l, v_h))
}

var arrMaskSatRGBA = function(hsv, h_l, h_h, s_l, s_h, v_l, v_h) {
    var [h, s, v] = hsv;
    if (h > h_l && h < h_h
        && s > s_l && s < s_h
        && v > v_l && v < v_h) {
        return [255,255,255,255]; // rbga white
    }
    return [0,0,0,255]; // rbga black
}

export var arrMaskMapRGBA = function(arr, h_l, h_h, s_l, s_h, v_l, v_h) {
    return arr.map(x => arrMaskSatRGBA(x, h_l, h_h, s_l, s_h, v_l, v_h))
}