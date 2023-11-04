/**
 * Enum defining different template types for questions.
 */
export enum TemplateType {
  /**
   * Multiple choice question with text.
   */
  MULTIPLE_CHOICE_QUESTION_TEXT = 'Q_MC_TXT_01',

  /**
   * Multiple choice question with an image.
   */
  MULTIPLE_CHOICE_QUESTION_IMAGE = 'Q_MC_IMG_01',

  /**
   * Multiple choice question with audio.
   */
  MULTIPLE_CHOICE_QUESTION_AUDIO = 'Q_MC_AUD_01',

  /**
   * True or false question.
   */
  TRUE_OR_FALSE = 'Q_TF_01',

  /**
   * Match the following question with text on both sides.
   */
  MATCH_THE_FOLLOWING_TEXT_TEXT = 'Q_MTF_TT_01',

  /**
   * Match the following question with text on one side and an image on the other.
   */
  MATCH_THE_FOLLOWING_TEXT_IMAGE = 'Q_MTF_TI_01',

  /**
   * Match the following question with text on one side and audio on the other.
   */
  MATCH_THE_FOLLOWING_TEXT_AUDIO = 'Q_MTF_TA_01',

  /**
   * Match the following question with audio on one side and an image on the other.
   */
  MATCH_THE_FOLLOWING_AUDIO_IMAGE = 'Q_MTF_AI_01',
}
