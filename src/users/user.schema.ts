import mongoose, {
  Schema,
  type Document,
  type Types,
  type Model,
} from "mongoose";

export interface User extends Document {
  email: string;
  isBlocked: boolean;
  password: string;
  roles: Types.ObjectId[];
  posts: Types.ObjectId[];
}

const userSchema: Schema<User> = new Schema<User>({
  email: { type: String, unique: true },
  isBlocked: Boolean,
  password: String,
  roles: [
    {
      type: Schema.Types.ObjectId,
      ref: "Role",
    },
  ],
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post",
    },
  ],
});

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const User: Model<User> = mongoose.model<User>("User", userSchema);
