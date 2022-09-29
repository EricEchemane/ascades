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
        validate: {
            validator: isValidEmail,
            message: "Email is invalid"
        }
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
        image: {
            type: String,
            required: [true, "Image is required"],
        },
        result: {
            type: String,
            required: [true, "Result is required"],
        },
        confidence: {
            type: Number,
            required: [true, "Confidence is required"],
        },
    }],
});

export type IUserSchema = InferSchemaType<typeof userSchema>;
export default userSchema;