import mongoose from "mongoose"
import { constants } from "./constants.js";

const ConnectDB = async () => {

    const connectionString = process.env.mongo_db_url + constants.DataBase
    console.log(connectionString)
    try {
        const con = await mongoose.connect(connectionString);
        console.log("MongoDB connected SuccessFully! ", con.connection.host);
    } catch (error) {
        console.log("Error While connecting MongoDB: ", error);
    }

}

export default ConnectDB;