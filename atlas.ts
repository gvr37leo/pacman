
class ImageView{

    constructor(public image:HTMLImageElement,
        public spos:Vector,
        public ssize:Vector,){

    }

    draw(dpos:Vector,dsize:Vector){
        ctxt.drawImage(this.image,this.spos.x,this.spos.y,this.ssize.x,this.ssize.y,dpos.x,dpos.y,dsize.x,dsize.y)
    }

    static fromImage(image:HTMLImageElement){
        return new ImageView(image,zero.c(),new Vector(image.width,image.height))
    }
}

class Sprite{
    constructor(
        public imageView:ImageView,
        public rotations:number = 0,
        public xflipped:boolean = false,
        public yflipped:boolean = false,){

    }

    static fromImage(image:HTMLImageElement,rot = 0, xflipped = false, yflipped = false){
        return new Sprite(ImageView.fromImage(image),rot,xflipped,yflipped)
    }

    c(){
        return new Sprite(this.imageView,this.rotations,this.xflipped,this.yflipped)
    }

    rot(rot:number){
        this.rotations += rot
        return this
    }

    draw(ctxt:Ctx,pos:Vector,size:Vector){
        var center = pos.c().add(size.c().scale(0.5))
        ctxt.save()
        var xflip = this.xflipped ? -1 : 1
        var yflip = this.yflipped ? -1 : 1

        ctxt.translate(center.x,center.y)
        ctxt.rotate(this.rotations * TAU)
        ctxt.scale(xflip,yflip)
        ctxt.translate(-center.x,-center.y)
        
        this.imageView.draw(pos,size)
        ctxt.restore()
    }
}

function disectAtlas(rows:number,columns:number,imageSize:Vector,padding:Vector,offset:Vector):Vector[]{
    var posses:Vector[] = []
    for(var i = 0; i < rows; i++){
        for(var j = 0; j < columns; j++){
            var pos = new Vector(0,0)
            pos.add(offset)
            pos.add(padding).mul(new Vector(j,i))
            pos.add(imageSize).mul(new Vector(j,i))
            posses.push(pos)
        }
    }
    return posses
}

function disectSimpleImageRow(colums:number,size:Vector){
    return disectAtlas(1,colums,size,zero,zero)
}

class AtlasAnimation{
    public anim:Anim
    
    

    constructor(
        public positions:Vector[],
        public image:Sprite,
        public size:Vector,){
            
        this.anim = new Anim()
        this.anim.stopwatch.start()
        this.anim.begin = 0
        this.anim.end = 1
        this.anim.duration = 1000
        this.anim.animType = AnimType.repeat
    }

    draw(ctxt:CanvasRenderingContext2D,pos:Vector,size:Vector){
        if(this.positions.length > 0){
            var i = Math.min(Math.floor(this.anim.get() * this.positions.length), this.positions.length - 1) 
            this.image.imageView.spos = this.positions[i]
            this.image.imageView.ssize = this.size
            this.image.draw(ctxt,pos,size)
        }
    }
}