const asyncHandler = (requestHandler)=>
{
    return (req,res,next) =>
    {
        Promise.resolve(requestHandler(req,res,next)).catch
        ((err)=> next(err))
    }
}

export {asyncHandler}
//Accepting the parameters as function and returning the parameters as functions
