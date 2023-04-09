import { EpochTimeStampGenetrator } from './epoch-time-stamp.generator';
import { RandomNumberGenetrator } from './random-number.generator';
import { RandomStringGenetrator } from './random-string.generator';

const lengthPerBlock = 8;

export class SubscriberIdGenetrator {
  public static gernerate() {
    return (
      RandomStringGenetrator.gernerate(lengthPerBlock).toUpperCase() +
      RandomStringGenetrator.gernerate(lengthPerBlock).toUpperCase() +
      RandomStringGenetrator.gernerate(lengthPerBlock).toUpperCase() +
      RandomStringGenetrator.gernerate(lengthPerBlock).toUpperCase() +
      RandomStringGenetrator.gernerate(lengthPerBlock).toUpperCase() +
      RandomStringGenetrator.gernerate(lengthPerBlock).toUpperCase() +
      RandomStringGenetrator.gernerate(lengthPerBlock).toUpperCase() +
      RandomStringGenetrator.gernerate(lengthPerBlock).toUpperCase() +
      RandomNumberGenetrator.gernerate(16) +
      EpochTimeStampGenetrator.gernerate()
    );
  }
}
