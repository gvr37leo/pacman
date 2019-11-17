class Ghost{
    speed = 6
    isFleeing:boolean = false
    isEaten:boolean = false
    dir:Vector = new Vector(1,0)

    constructor(public pos:Vector, public color:string, public scattertile:Vector, public target:() => Vector){

    }

    getTarget(){
        if(this.isEaten){
            return new Vector()
        }
        else if(this.isFleeing){
            return [new Vector(0,0), new Vector(levelsize.x,levelsize.y), new Vector(levelsize.x,0),new Vector(0,levelsize.y)][Math.floor(random(0,4))]
        }else if(scattermode){
            return this.scattertile
        }else{
            return this.target()
        }
    }

    draw(){
        ctxt.fillStyle = this.color
        if(this.isFleeing){
            ctxt.fillStyle = 'blue'
        }
        fillrectCentered(this.pos)
    }
}