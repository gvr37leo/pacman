function loadImages(urls:string[]):Promise<HTMLImageElement[]>{
    var promises:Promise<HTMLImageElement>[] = []

    for(var url of urls){
        promises.push(new Promise((res,rej) => {
            var image = new Image()
            image.onload = e => {
                res(image)     
            }
            image.src = url
        }))
    }

    return Promise.all(promises)
}

function convertImages2Imagedata(images:HTMLImageElement[]):ImageData[]{
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    var result:ImageData[] = []
    for(var img of images){
        canvas.width = img.width;
        canvas.height = img.height;
        context.drawImage(img, 0, 0 );
        result.push(context.getImageData(0, 0, img.width, img.height))
    }
    return result
}

function convertImageData2board(image:ImageData):Tiletype[][]{
    return createNDimArray([image.height,image.width],pos => {
        var i = index(pos.y,pos.x,image.width)
        var color = image.data.slice(i,i + 3)
        return colorsrgb.findIndex(crgb => arrayequal(crgb,color as any))
    })
}

function index(x,y,width){
    return y * (width * 4) + x * 4;
}

function arrayequal(a:any[],b:any[]){
    return !a.some((v,i) => a[i] != b[i])
}

function vectorequal(a:Vector,b:Vector){
    return arrayequal(a.vals,b.vals)
}

function fillrect(v:Vector){
    ctxt.fillRect(v.x * tilesize.x,v.y * tilesize.y,tilesize.x,tilesize.y)
}

function fillrectCentered(v:Vector){
    var halfsize = tilesize.c().scale(0.5)
    ctxt.fillRect(v.x * tilesize.x - halfsize.x,v.y * tilesize.y - halfsize.y,tilesize.x,tilesize.y)
}

function round(v:Vector){
    return v.map((arr,i) => arr[i] = Math.round(arr[i]))
}

function floor(v:Vector){
    return v.map((arr,i) => arr[i] = Math.floor(arr[i]))
}

function getQuadrant(pos:Vector):Direction{
    var floor = pos.c().map((arr,i) => arr[i] = Math.floor(arr[i]))
    var pc = pos.c().sub(floor).sub(new Vector(0.5,0.5))

    if(Math.abs(pc.x) > Math.abs(pc.y)){
        if(pc.x > 0){
            return Direction.east
        }else{
            return Direction.west
        }
    }else{
        if(pc.y > 0){
            return Direction.south
        }else{
            return Direction.north
        }
    }
}