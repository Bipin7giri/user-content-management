import mongoose, {
  Schema,
  type Document,
  type Model,
  type Types,
} from "mongoose";

interface Role extends Document {
  name: "VIEWER" | "ADMIN" | "EDITOR";
  users: Types.ObjectId[];
  streamers: Types.ObjectId[];
}

const roleSchema: Schema<Role> = new Schema<Role>({
  name: {
    type: String,
    enum: ["VIEWER", "ADMIN", "EDITOR"],
    default: "VIEWER",
  },
});

// eslint-disable-next-line @typescript-eslint/no-redeclare
const Role: Model<Role> = mongoose.model<Role>("Role", roleSchema);

export { Role };
