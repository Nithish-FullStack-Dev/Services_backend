import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  latitude: Number,
  longitude: Number,
});

export default addressSchema;
