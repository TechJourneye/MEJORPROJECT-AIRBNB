
class ExpressError extends Error{
    constructor(StatusCode,message){
        super();//super is used for callig parent class constructor 
        this.StatusCode=StatusCode;
        this.message=message;
    }
}

module.exports=ExpressError;