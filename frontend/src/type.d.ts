import { TUser } from "./interfaces/user";

type UserState = {
    currentUser: TUser
  }

  type UserAction = {
    type: string
    user: TUser
  }
  
  type DispatchType = (args: UserAction) => UserAction
