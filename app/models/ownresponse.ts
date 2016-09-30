export class OwnResponse {
  static rxStatus: RegExp = /^\*(\d+)\*(\d+)\*(\d+)$/;

  static parseResponse(response: string): OwnResponse {
      let mStatus = OwnResponse.rxStatus.exec(response);
      if (mStatus && mStatus.length === 4) {
        let full, who, what, where;
        [full, who, what, where] = mStatus;

        return new OwnResponse(parseInt(who), parseInt(what), parseInt(where));
      }
  }

  constructor(public who: number, public what: number, public where: number) {

  }
}
