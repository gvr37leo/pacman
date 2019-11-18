class Pacman{
    speed = 7
    prefferedDir:Vector = new Vector(1,0)
    constructor(public pos:Vector, public dir:Vector){

    }

    draw(){
        ctxt.fillStyle = 'grey'
        fillrectCentered(this.pos)
        pacmananimation.draw(ctxt,this.pos,tilesize)
    }
}