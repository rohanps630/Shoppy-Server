import { EpochTimeStampGenetrator } from './epoch-time-stamp.generator';
import { RandomNumberGenetrator } from './random-number.generator';
import { RandomStringGenetrator } from './random-string.generator';

const lengthPerBlock = 8;

export class UniqueScoketIdGenetrator {
  public static gernerate() {
    return (
      RandomStringGenetrator.gernerate().toUpperCase() +
      RandomStringGenetrator.gernerate(lengthPerBlock) +
      RandomStringGenetrator.gernerate(lengthPerBlock) +
      RandomStringGenetrator.gernerate(lengthPerBlock) +
      RandomStringGenetrator.gernerate(lengthPerBlock) +
      RandomStringGenetrator.gernerate(lengthPerBlock) +
      RandomStringGenetrator.gernerate(lengthPerBlock) +
      RandomNumberGenetrator.gernerate(16) +
      EpochTimeStampGenetrator.gernerate()
    );
  }
}
