export interface IChat {
  id: string;
  isRoom: boolean;
  time: number;
  status: string;
  photo: string;
  online: boolean;
  noChecked: number;
  message: string;
  file: string | undefined;
  name: string;
  exitDate: number | false;
}

export interface IMessage {
  id: string;
  type: string;
  text: string;
  status: string;
  photo: string;
  date: number;
  file?: string;
}

export interface ISelectedChat {
  chat: IChat;
  messages: IMessage[];
}

export enum Status {
  dispatch = "dispatch",
  writing = "writing...",
}
export type statusType = Status.dispatch | Status.writing;