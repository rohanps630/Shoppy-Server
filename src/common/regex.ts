export class Regex {
  // Common regular expressions
  public static get PHONE_NUMBER(): string {
    return '^(\\+\\d{1,2}\\s?)?1?\\-?\\.?\\s?\\(?\\d{3}\\)?[\\s.-]?\\d{3}[\\s.-]?\\d{4}$';
  }
  public static get EMAIL(): string {
    return '^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@' + '(?:[a-zA-Z0-9-]+\\.)' + '+[a-zA-Z]{2,7}$';
  }
  public static get MODERATE_PASSWORD(): string {
    return '^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?!.*s).{8,}$';
  }

  // Additional regular expressions
  public static get URL(): string {
    return '^(https?://)?[a-zA-Z0-9.-]+\\.[a-z]{2,6}(/[/\\w .-]*)/?$';
  }
  public static get DATE(): string {
    return '^d{4}-d{2}-d{2}$';
  }
  public static get ZIP_CODE(): string {
    return '^d{5}$';
  }
  public static get IP_ADDRESS(): string {
    return '^d{1,3}.d{1,3}.d{1,3}.d{1,3}$';
  }
  public static get USERNAME(): string {
    return '^[a-zA-Z0-9_]+$';
  }
  public static get HEX_COLOR(): string {
    return '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$';
  }
  public static get CREDIT_CARD(): string {
    return '^d{4}-d{4}-d{4}-d{4}$';
  }
  public static get STRONG_PASSWORD(): string {
    return '^(?=.*[a-z])(?=.*[A-Z])(?=.*d)(?=.*[@#$%^&+=!])(?!.*s).{8,}$';
  }
  public static get HTML_TAGS(): string {
    return '<[^>]+>';
  }
  public static get FIVE_DIGIT_CODE(): string {
    return '^d{5}$';
  }
  public static get TIME_24_HOUR(): string {
    return '^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$';
  }
  public static get UUID(): string {
    return '^[a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$';
  }
  public static get COMMON_EMAIL(): string {
    return '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$';
  }
  public static get SUBDOMAIN_EMAIL(): string {
    return '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}\\.([a-zA-Z]{2,}|[0-9]{1,3})$';
  }
  public static get EDU_EMAIL(): string {
    return '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.edu$';
  }
  public static get GOV_EMAIL(): string {
    return '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.gov$';
  }
}
