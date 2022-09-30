import { Schema, InferSchemaType } from 'mongoose';
import isValidEmail from '../utils/email-validator';

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    image: {
        type: String,
        required: [true, "Image is required"],
    },
    birthDate: {
        type: Date,
        required: [true, "Birth date is required"],
    },
    gender: {
        type: String,
        requried: [true, "Gender is required"]
    },
    testsHistory: [{
        date: {
            type: String,
            required: [true, "Date is required"]
        },
        image: {
            type: String,
            required: [true, "Image is required"],
        },
        diagnosis: {
            type: String,
            required: [true, "Diagnosis is required"],
        },
        accuracy: {
            type: Number,
            required: [true, "Accuracy is required"],
        },
    }],
});

export type IUser = InferSchemaType<typeof userSchema>;
export default userSchema;