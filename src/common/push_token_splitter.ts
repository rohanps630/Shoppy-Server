export interface PushTokenGroup {
  readonly apns: string | string;
  readonly fcm: string | string;
  readonly voip: string | string;
  readonly isSandBox: boolean;
}

class PushTokenGroupImpl implements PushTokenGroup {
  apns: string | string = '';
  fcm: string | string = '';
  voip: string | string = '';
  isSandBox = false;
}

export class PushTokenSplitter {
  public static split(tokenString: string): PushTokenGroup {
    const tokenGroup = new PushTokenGroupImpl();

    if (!tokenString) return tokenGroup;

    const list = tokenString.split(',');

    list.forEach((element) => {
      const token = element.trim();

      if (token.includes('IS_SAND_BOX:')) {
        let isSandBox = token.replace('IS_SAND_BOX:', '').trim() + '';
        isSandBox = isSandBox.toLowerCase();

        if (isSandBox == 'true' || isSandBox == '1') {
          tokenGroup.isSandBox = true;
        } else {
          tokenGroup.isSandBox = false;
        }
      } else if (token.includes('APNS:')) {
        tokenGroup.apns = token.replace('APNS:', '').trim();
      } else if (token.includes('APN:')) {
        tokenGroup.apns = token.replace('APN:', '').trim();
      } else if (token.includes('VOIP:')) {
        tokenGroup.voip = token.replace('VOIP:', '').trim();
      } else {
        tokenGroup.fcm = token.replace('FCM:', '').trim();
      }
    });

    return tokenGroup;
  }
}
