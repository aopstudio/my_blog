/**
 * @description User-Service parameters
 */
export interface ArticleInfo {
  id?: number;
  author?: string;
  title?: string;
  content?: string;
  tags?: string;
}

export interface UserInfo {
  id?: number;
  name?: string;
  password?: string;
  avatar?: string;
}

export interface PasswordInfo {
  old_password: string;
  new_password: string;
}
