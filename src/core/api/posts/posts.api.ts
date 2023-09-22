import { post, get } from '../http';
import { SuccessRes, PaginateReq } from '../types';
import { CommentReq, CommentsRes, Post, PostReq, PostsRes, ReportReq } from './posts.types';

export async function posts(params: PaginateReq): Promise<PostsRes> {
  return (await get<PostsRes>('posts', { params })).data;
}

export async function createPost(payload: PostReq): Promise<Post> {
  return (await post<Post>('posts', payload)).data;
}

export async function updatePost(id: string, payload: PostReq): Promise<Post> {
  return (await post<Post>(`posts/update/${id}`, payload)).data;
}

export async function removePost(id: string): Promise<SuccessRes> {
  return (await post<SuccessRes>(`posts/remove/${id}`, {})).data;
}

export async function likePost(id: string): Promise<SuccessRes> {
  return (await post<SuccessRes>(`posts/${id}/like`, {})).data;
}

export async function unlikePost(id: string): Promise<SuccessRes> {
  return (await post<SuccessRes>(`posts/${id}/unlike`, {})).data;
}

export async function reportPost(id: string, payload: ReportReq): Promise<SuccessRes> {
  return (await post<SuccessRes>(`posts/${id}/report`, payload)).data;
}

export async function getPost(id: string): Promise<Post> {
  return (await get<Post>(`posts/${id}`)).data;
}

export async function postComments(postId: string, params: PaginateReq): Promise<CommentsRes> {
  return (await get<CommentsRes>(`posts/${postId}/comments`, { params })).data;
}

export async function createPostComment(postId: string, payload: CommentReq): Promise<Comment> {
  return (await post<Comment>(`posts/${postId}/comments`, payload)).data;
}

export async function removePostComment(commentId: string): Promise<Comment> {
  return (await post<Comment>(`posts/comments/remove/${commentId}`, {})).data;
}

export async function likePostComment(postId: string, commentId: string): Promise<Comment> {
  return (await post<Comment>(`posts/${postId}/comments/${commentId}/like`, {})).data;
}

export async function unlikePostComment(postId: string, commentId: string): Promise<Comment> {
  return (await post<Comment>(`posts/${postId}/comments/${commentId}/unlike`, {})).data;
}
