export interface IArticle {
    id?: string;
    user_id: string;
    title: string;
    tag_id: string;
    thumbnail: string;
    content: string;
    created_at?: Date;
    updated_at?: Date;
}
