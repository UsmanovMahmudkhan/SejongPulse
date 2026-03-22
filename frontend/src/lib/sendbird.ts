// src/lib/sendbird.ts
import SendbirdChat from "@sendbird/chat";
import { GroupChannelModule } from "@sendbird/chat/groupChannel";

export const APP_ID = process.env.NEXT_PUBLIC_SENDBIRD_APP_ID || "";

let sb: any;

export function getSendbirdClient() {
  if (!sb) {
    sb = SendbirdChat.init({
      appId: APP_ID,
      modules: [new GroupChannelModule()],
    });
  }
  return sb;
}
