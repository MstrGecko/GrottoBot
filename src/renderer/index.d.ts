import { User } from './helpers/db/db';
/**
 * IConfig holds all of the configuration options on how things should be handled. 
 * @Mstrgecko Apr 4 2020
 */
export interface IConfig {
  authKey: null | string;
  streamerAuthKey: null | string;
  commandPrefix: string;
  lang: string;
  appearance: string;
  chatProfileShadows?: IChatColors;
  selectedSender?: IOption;
  pointsTimer?: number;
  points?: number;
  donationSettings?: {
    lemons?: number;
    icecream?: number;
    diamond?: number;
    ninja?: number;
    ninjet?: number;
  };
  eventConfig?: {
    enableDebounceEvents?: boolean; //spam filter
    enableEventMessages?: boolean; //global toggle for all event messages
    onDiamond?: string;
    onFollow?: string;
    onGiftedSub?: string;
    onIcecream?: string;
    onLemon?: string;
    onNinja?: string;
    onNinjet?: string;
    onSub?: string;
  };
  tts_Amplitude?: number;
  tts_Pitch?: number;
  tts_Speed?: number;
  hasTTSDonations?: boolean;
  allowedTTSDonations?: ISelectOption<
    'LEMON' | 'ICE_CREAM' | 'DIAMOND' | 'NINJAGHINI' | 'NINJET'
  >[];
  hasTTSDonationMessages?: boolean;
  tts_Voice?: IOption;

}

export interface IEvent {
  data: { [id: string]: any };
  name: string;
}

export interface IRXEvent {
  payload: {
    message?: string;
    data?: { [id: string]: any };
  };
  type: string;
}
/**
 * IMe(I Me) defines the streamer 
 * @Mstrgecko Apr 4 2020
 */
export interface IMe {
  displayname: string;
  username: string;
  livestream: {
    createdAt: string;
  };
}

/**
 * ISender defines the sernder of a message 
 * @Mstrgecko Apr 4 2020
 */

 export interface ISender {
  avatar: string;
  badges: {}[];
  displayname: string;
  id: string;
  partnerStatus: string;
  username: string;
  __typename: string;
}
/**
 * IChatObject defines a basic Chat Object, with all the info we will use to display chat and take actions. 
 * @Mstrgecko Apr 4 2020
 */
export interface IChatObject {
  type:
    | 'Follow'
    | 'Subscription'
    | 'Message'
    | 'Gift'
    | 'GiftSubReceive'
    | 'Delete'
    | 'Host';
  id: string;
  content?: string;
  createdAt: string;
  role: string;
  roomRole: string;
  sender: ISender;
  subscribing?: boolean;
  __typename: string;
  ids?: string[];
  deleted?: boolean;
}
/**
 * IGiftObject defines a ChatObject containing a Gift. Currently Specific to DLive  
 * @Mstrgecko Apr 4 2020
 */
export interface IGiftObject extends IChatObject {
  gift: 'LEMON' | 'ICE_CREAM' | 'DIAMOND' | 'NINJAGHINI' | 'NINJET';
  amount: string;
  message?: string;
  expireDuration: number;
  recentCount: number;
}
/**
 * IFollowObject currently looks like a nearly needless wrapper on IChatObject 
 * @Mstrgecko Apr 4 2020
 */
export interface IFollowObject extends IChatObject {
  type: 'Follow';
}


/**
 * IHostObject Defines a IChatobject with the required additions to check hosted viewer ccount.  
 * @Mstrgecko May 7 2020
 */

export interface IHostObject extends IChatObject {
  type: 'Host'; 
  viewer: number;
}

/**
 * ISubObject defines how many months a subscriber has subbed.
 * @Mstrgecko Apr 4 2020
 */
export interface ISubObject extends IChatObject {
  month: string;
}
/**
 * ISubJoject defines  the gifter and the recipient of a Gifted Sub.
 * @Mstrgecko Apr 4 2020
 */
export interface IGiftedSubObject extends IChatObject {
  receiver?: string;
  gifter?: IUser;
}
/**
 * IChatColors is a "Palette" of role colors to be used to differenciate chat member roles 
 * @Mstrgecko Apr 4 2020
 */
export interface IChatColors {
  owner: string;
  bot: string;
  staff: string;
  viewer: string;
  moderator: string;
}
/**
 * IOption is a generic definition that lets is store values, but name them something else.  
 * @Mstrgecko Apr 4 2020
 */
export interface IOption {
  label: string;
  value: string;
}
/**
 * IChange is used in a way i don't understand yet 
 * @Mstrgecko Apr 4 2020
 */

export interface IChange {
  name: 'addUser' | 'removeUser';
  data: User | null;
}

/**
 * IUser defines all of the things we want to trach about a chat user. 
 * @Mstrgecko Apr 4 2020
 */
export interface IUser {
  id: string;
  displayname: string;
  username: string;
  avatar: string;
  lino: number;
  points: number;
  exp: number;
  role: string;
  roomRole: string;
  isSubscribed: boolean;
}
/**
 * ICommand Defines all the things we want to store about how a Command is used.  
 * @Mstrgecko Apr 4 2020
 */

export interface ICommand {
  id: string;
  name: string;
  permissions: any[];
  reply: string;
  cost: number;
  enabled: boolean;
}
/**
 * IAlert Defines all the things we want to store about how an Alert is used.  
 * @Mstrgecko Apr 4 2020
 */

export interface IAlert {
  id: string;
  name: string;
  permissions: any[];
  reply: string;
  cost: number;
  enabled: boolean;
  sound: string;
  image: string;
  duration:number;
}
/**
 * ITimer Defines all the things we want to store about how a Timed Bot message works.  
 * @Mstrgecko Apr 4 2020
 */

export interface ITimer {
  name: string;
  seconds: number;
  reply: string;
  enabled: boolean;
  messages: number;
}
/**
 * ICustomVariable Defines all the things we want to store about how a Custom Variables work.  
 * @Mstrgecko Apr 4 2020
 */

export interface ICustomVariable {
  name: string;
  replyString: string;
  isEval: boolean | null;
}
/**
 * ISize works in a way i don't yet understand. 
 * @Mstrgecko Apr 4 2020
 */

export interface ISize {
  width: number;
  height: number;
}
/**
 * IListRenderer works in a way i don't yet understand.  
 * @Mstrgecko Apr 4 2020
 */

export interface IListRenderer {
  index: number;
  key: string;
  style: React.CSSProperties;
}
/**
 * IOldUser is an interface wrapper between the old and new user format.   
 * @Mstrgecko Apr 4 2020
 */

export interface IOldUser extends IUser {
  dliveUsername?: string;
  linoUsername?: string;
  blockchainUsername?: string;
}
/**
 * ISelectOption is a vector of IOptions, for making dropdown menues sane?  
 * @Mstrgecko Apr 4 2020
 */

export interface ISelectOption<T = string> {
  label: string;
  value: T;
}

declare module '*.json' {
  const value: any;
  export default value;
}

// export interface IUpdateChangeCustom extends IUpdateChange {
//   obj: IUser;
//   oldObj: IUser;
// }

// export interface IDeleteChangeCustom extends IDeleteChange {
//   obj: IUser;
// }

// export type IDatabaseChange =
//   | ICreateChange
//   | IUpdateChangeCustom
//   | IDeleteChangeCustom;
