// const mongoose = require('mongoose');

// const mongoURI = 'mongodb+srv://gofood:burger1234@cluster0.4jgmj.mongodb.net/gofoodmern?retryWrites=true&w=majority&appName=Cluster0';

// const mongoDB = async () =>{
//     await mongoose.connect(mongoURI, { useNewUrlParser: true }, async(err, result)=> {
//     if (err) console.log("------", err)
//     else {
//         console.log("Connected to MongoDB!");
//         const fetched_data = await mongoose.connection.db.collection("food_items");
//         fetched_data.find({}).toArray( async function (err, data) {
//             const foodCategory = await mongoose.connection.db.collection("foodCategory");
//             foodCategory.find({}).toArray(function (err, catData){
//                 if (err) console.log(err);
//                 else {
//                     global.food_items = data;
//                     global.foodCategory = catData;
//                     }
//             })

//         })
//     }

// })
// }
// module.exports = mongoDB;


const mongoose = require('mongoose');

const mongoURI = 'mongodb+srv://gofood:burger1234@cluster0.4jgmj.mongodb.net/gofoodmern?retryWrites=true&w=majority&appName=Cluster0';

const mongoDB = async () => {
    console.log("Attempting to connect to MongoDB...");
    try {
        await mongoose.connect(mongoURI); // Removed the callback
        console.log("Connected to MongoDB!");

        // Fetch food items
        const fetched_data = mongoose.connection.db.collection("food_items");
        const data = await fetched_data.find({}).toArray();

        // Fetch food categories
        const foodCategory = await mongoose.connection.db.collection("foodCategory");
        const catData = await foodCategory.find({}).toArray();

        // Store data in global variables
        global.food_items = data;
        global.foodCategory = catData;

        console.log("Fetched food items:", global.food_items);
        console.log("Fetched food categories:", global.foodCategory);
    } catch (err) {
        console.error("Error connecting to MongoDB:", err);
    }
};

module.exports = mongoDB;


