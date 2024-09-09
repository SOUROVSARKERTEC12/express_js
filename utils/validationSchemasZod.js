import { z } from "zod";

export const createUserValidationSchema = z.object({
    username: z
        .string({ required_error: "Username is required" })
        .min(5, { message: "Username must be at least 5 characters long" })
        .max(32, { message: "Username cannot be longer than 32 characters" })
        .nonempty({ message: "Username cannot be empty" }), // Custom message for empty username
    displayName: z
        .string({ required_error: "displayName is required" })
        .nonempty({ message: "Display name cannot be empty" }), // Custom message for empty displayName
}).strict();
