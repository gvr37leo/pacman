class Ghost{
    speed = 6
    fleeing:boolean = false
    dir:Vector = new Vector(1,0)

    constructor(public pos:Vector, public color:string, public fleetile:Vector, public target:() => Vector){

    }

    getTarget(){
        if(scattermode){
            return this.fleetile
        }
        else if(this.fleeing){
            return this.fleetile
        }else{
            return this.target()
        }
    }

    draw(){
        ctxt.fillStyle = this.color
        fillrectCentered(this.pos)
    }
}