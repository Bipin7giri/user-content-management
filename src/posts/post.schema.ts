/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import mongoose, {
  type Document,
  type Model,
  Schema,
  type Types,
} from "mongoose";

export interface Post extends Document {
  postId: number;
  content: string;
  creator: Types.ObjectId;
  created_at: Date;
  tags: string[];
  editor: Types.ObjectId[];
  isDeleted: boolean;
  isActive: boolean;
}

const PostSchema = new Schema<Post>(
  {
    postId: { type: Number, unique: true },
    content: String,
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    created_at: { type: Date, default: Date.now },
    tags: [String],
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
    editor: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);
PostSchema.pre<Post>("save", async function (next) {
  try {
    if (!this.postId) {
      const lastPost = (await (this.constructor as Model<Post>).findOne(
        {},
        {},
        { sort: { postId: -1 } }
      )) as Post;
      if (lastPost) {
        this.postId = lastPost.postId + 1;
      } else {
        this.postId = 1000;
      }
    }

    next();
  } catch (error) {
    next();
  }
});

// eslint-disable-next-line @typescript-eslint/no-redeclare
export const Post: Model<Post> = mongoose.model<Post>("Post", PostSchema);
