// Define our labelmap
const labelMap = {
    1:{name:'A', color:'red'},
    2:{name:'B', color:'yellow'},
    3:{name:'C', color:'lime'},
    4:{name:'D', color:'blue'},
    5:{name:'E', color:'purple'},
    6:{name:'F', color:'red'},
    7:{name:'G', color:'yellow'},
    8:{name:'H', color:'lime'},
    9:{name:'I', color:'blue'},
    10:{name:'J', color:'purple'},
    11:{name:'K', color:'red'},
    12:{name:'L', color:'yellow'},
    13:{name:'M', color:'lime'},
    14:{name:'N', color:'blue'},
    15:{name:'O', color:'purple'},
    16:{name:'P', color:'red'},
    17:{name:'Q', color:'yellow'},
    18:{name:'R', color:'lime'},
    19:{name:'S', color:'blue'},
    20:{name:'T', color:'purple'},
    20:{name:'U', color:'red'},
    21:{name:'V', color:'yellow'},
    22:{name:'W', color:'lime'},
    23:{name:'X', color:'blue'},
    24:{name:'Y', color:'purple'},
    25:{name:'Z', color:'lime'},
}

// Define a drawing function
export const drawRect = (boxes, classes, scores, threshold, imgWidth, imgHeight, ctx)=>{
    for(let i=0; i<=boxes.length; i++){
        if(boxes[i] && classes[i] && scores[i]>threshold){
            // Extract variables
            const [y,x,height,width] = boxes[i]
            const text = classes[i]
            
            // Set styling
            ctx.strokeStyle = labelMap[text]['color']
            ctx.lineWidth = 10
            ctx.fillStyle = 'white'
            ctx.font = '30px Arial'         
            
            // DRAW!!
            ctx.beginPath()
            ctx.fillText(labelMap[text]['name'] + ' - ' + Math.round(scores[i]*100)/100, x*imgWidth, y*imgHeight-10)
            ctx.rect(x*imgWidth, y*imgHeight, width*imgWidth/2, height*imgHeight/1.5);
            ctx.stroke()
        }
    }
}