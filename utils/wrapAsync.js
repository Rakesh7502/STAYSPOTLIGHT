// module.exports= (fn)=>{
//     return function (req,res,next){
//         fn(req,res,next).catch(next);
//     };
// };

// wrapAsync.js
module.exports = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
  