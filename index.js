import { app } from "./app.js";

app.listen(process.env.PORT||5000,()=>{
    console.log(` Server is running at port :${process.env.PORT}`);
   })
   app.on("error",(error)=>{
            console.log("Error: ", error);
            throw error;
    })
