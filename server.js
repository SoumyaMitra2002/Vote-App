const exp=require("express");
const app=exp();
const bodyParser=require("body-parser");
app.use(bodyParser.json());
const mongoose=require("mongoose");
const router=require("./routes/userRoute")
const crouter = require("./routes/candidateRoute");
app.use("/api/v1/user",router);
app.use("/api/v1/candidate",crouter);
mongoose.connect("mongodb://localhost:27017/vote")
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

app.listen(3000,()=>{
    console.log("Server at 3000")
})