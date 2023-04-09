import { EpochTimeStampGenetrator } from './epoch-time-stamp.generator';
import { RandomNumberGenetrator } from './random-number.generator';
import { RandomStringGenetrator } from './random-string.generator';
import { v4 as UUID } from 'uuid';

const splitter = '-';
const lengthPerBlock = 6;

export class UniqueIdGenetrator {
  public static gernerate() {
    return (
      RandomStringGenetrator.gernerate().toUpperCase() +
      splitter +
      RandomStringGenetrator.gernerate(lengthPerBlock) +
      splitter +
      RandomNumberGenetrator.gernerate(lengthPerBlock) +
      splitter +
      RandomStringGenetrator.gernerate(lengthPerBlock) +
      splitter +
      // + RandomNumberGenetrator.gernerate(lengthPerBlock) + splitter
      // + RandomStringGenetrator.gernerate(lengthPerBlock) + splitter
      RandomNumberGenetrator.gernerate(lengthPerBlock) +
      splitter +
      EpochTimeStampGenetrator.gernerate()
    );
  }

  public static gernerateUUID() {
    return UUID();
  }
}
