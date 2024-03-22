import { ApiSuccessStatus } from "../constant/message.constant";
import { Logger } from "../logger/loger";
import { User } from "../users/user.schema";
import { type PaginatedResponse } from "../utils/PaginationResponse";
import { Post } from "./post.schema";

export class PostService {
  constructor(
    private readonly postModel = Post,
    private readonly log = new Logger(),
    private readonly userModel = User
  ) {}

  /**
   * Creates a new post.
   * @param userId The ID of the user who created the post.
   * @param post The post data.
   * @returns The status code for the response.
   */
  async create(userId: string, post: Post): Promise<string> {
    try {
      const newPost = await this.postModel.create({
        content: post.content,
        creator: userId,
        created_at: post.created_at,
        tags: post.tags,
        isActive: post.isActive,
        isDeleted: post.isDeleted,
        editor: post.editor,
      });
      await this.userModel.findOneAndUpdate(
        {
          _id: userId,
        },
        {
          $push: {
            posts: newPost._id,
          },
        }
      );

      await newPost.save();
      return ApiSuccessStatus.CREATED;
    } catch (error) {
      this.log.logError(error as Error);
      throw error;
    }
  }

  /**
   * Updates the tags of a post.
   * @param postId The ID of the post to update.
   * @param tags The tags to add to the post.
   * @returns The status code for the response.
   */
  async updateTags(postId: number, tags: string[]): Promise<string> {
    console.log(postId);
    try {
      const post = await this.postModel.findOne({
        postId,
      });

      if (post?.created_at != null) {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000); // 1 hour ago
        if (post.created_at < oneHourAgo) {
          await this.postModel.findOneAndUpdate(
            {
              postId,
            },
            {
              $push: { tags },
            },
            { new: true } // To return the updated document
          );
          return ApiSuccessStatus.UPDATED;
        } else {
          throw new Error(
            "Post cannot be updated as it's not more than 1 hour old."
          );
        }
      } else {
        throw new Error("Post not found or creation date missing.");
      }
    } catch (error) {
      this.log.logError(error as Error);
      throw error;
    }
  }

  /**
   * Updates the editors of a post.
   * @param postId The ID of the post to update.
   * @param editor The editor to add to the post.
   * @returns The status code for the response.
   */
  async updateEditors(postId: string, editor: string): Promise<string> {
    try {
      await this.postModel.findOneAndUpdate(
        {
          postId,
        },
        {
          $push: { editor },
        },
        { new: true } // To return the updated document
      );
      return ApiSuccessStatus.UPDATED;
    } catch (error) {
      this.log.logError(error as Error);
      throw error;
    }
  }

  /**
   * Updates the content of a post.
   * @param postId The ID of the post to update.
   * @param data The updated content of the post.
   * @returns The status code for the response.
   */
  async updatePost(postId: number, data: Post): Promise<string> {
    try {
      await this.postModel.findOneAndUpdate(
        {
          postId: Number(postId),
        },
        {
          content: data.content,
        },
        { new: true } // To return the updated document
      );
      return ApiSuccessStatus.UPDATED;
    } catch (error) {
      this.log.logError(error as Error);
      throw error;
    }
  }

  /**
   * Removes a post from the database.
   * @param postId The ID of the post to remove.
   * @returns The status code for the response.
   */
  async remove(postId: string): Promise<string> {
    try {
      await this.postModel.findOneAndUpdate(
        {
          postId,
        },
        {
          isDeleted: true,
        }
      );
      return ApiSuccessStatus.DELETED;
    } catch (error) {
      this.log.logError(error as Error);
      throw error;
    }
  }

  /**
   * Searches for a single post by its ID.
   * @param postId The ID of the post to search for.
   * @returns The post with the specified ID, or null if no post was found.
   */
  async findOne(postId: number): Promise<Post | null> {
    try {
      const post = await this.postModel.findOne({
        postId,
      });
      return post;
    } catch (error) {
      this.log.logError(error as Error);
      throw error;
    }
  }

  /**
   * Retrieves a list of all posts, sorted by creation date, with pagination.
   * @param page The page number to retrieve.
   * @param limit The number of posts per page.
   * @returns A paginated response containing the posts and pagination information.
   */
  async findAll(
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Post>> {
    try {
      const totalItems = await this.postModel.countDocuments();
      const skip = (page - 1) * limit;
      const totalPages = Math.ceil(totalItems / limit);

      const posts = await this.postModel
        .find({
          isActive: true,
          isDeleted: false,
        })
        .populate({
          path: "creator",
          select: "email", // Specify the fields you want to include (e.g., 'email')
        })
        .populate({
          path: "editor",
          select: "email", // Specify the fields you want to include (e.g., 'email')
        })
        .skip(skip)
        .limit(limit)
        .sort({ created_at: -1 });

      const paginationInfo: PaginatedResponse<Post> = {
        totalItems,
        itemsPerPage: limit,
        currentPage: page,
        totalPages,
        data: posts,
      };

      return paginationInfo;
    } catch (error) {
      this.log.logError(error as Error);
      throw error;
    }
  }

  /**
   * Retrieves a list of all posts, sorted by creation date, with pagination.
   * @param page The page number to retrieve.
   * @param limit The number of posts per page.
   * @returns A paginated response containing the posts and pagination information.
   */
  async findByUserId(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Post>> {
    try {
      const totalItems = await this.postModel.countDocuments();
      const skip = (page - 1) * limit;
      const totalPages = Math.ceil(totalItems / limit);

      const posts = await this.postModel
        .find({
          isActive: true,
          isDeleted: false,
          creator: userId,
        })
        .skip(skip)
        .limit(limit)
        .sort({ created_at: -1 });

      const paginationInfo: PaginatedResponse<Post> = {
        totalItems,
        itemsPerPage: limit,
        currentPage: page,
        totalPages,
        data: posts,
      };

      return paginationInfo;
    } catch (error) {
      this.log.logError(error as Error);
      throw error;
    }
  }

  /**
   * Retrieves a list of all posts, sorted by creation date, with pagination.
   * @param page The page number to retrieve.
   * @param limit The number of posts per page.
   * @returns A paginated response containing the posts and pagination information.
   */
  async findByEditorId(
    editorId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Post>> {
    try {
      const totalItems = await this.postModel.countDocuments();
      const skip = (page - 1) * limit;
      const totalPages = Math.ceil(totalItems / limit);

      const posts = await this.postModel
        .find({
          isActive: true,
          isDeleted: false,
          editor: editorId,
        })
        .skip(skip)
        .limit(limit)
        .sort({ created_at: -1 });

      const paginationInfo: PaginatedResponse<Post> = {
        totalItems,
        itemsPerPage: limit,
        currentPage: page,
        totalPages,
        data: posts,
      };

      return paginationInfo;
    } catch (error) {
      this.log.logError(error as Error);
      throw error;
    }
  }
}
