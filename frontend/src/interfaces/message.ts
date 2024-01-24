export type TMessage = {
  _id: string;
  forumId: string;
  owner: number;
  content: String;
  date: Date;
  deleted: Boolean;
};