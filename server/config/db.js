const mongoosee = require('mongoose');
const connectDB = async ()=>{
    try{
        mongoosee.set('strictQuery' , false);
        const conn = await mongoosee.connect(process.env.MONGODB_URI);
        console.log(`Database connected : ${conn.connection.host}`);
        
    }catch(error){
        console.log(error);
        
    }
}


module.exports = connectDB;
