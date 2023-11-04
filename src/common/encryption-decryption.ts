export class EncryptionDecryption {
  static encryption(s: string) {
    const l = s.length;
    let b = Math.ceil(Math.sqrt(l));
    let a = Math.floor(Math.sqrt(l));
    let encrypted = '';

    if (b * a < l) {
      if (Math.min(b, a) == b) {
        b = b + 1;
      } else {
        a = a + 1;
      }
    }

    const arr = [];

    for (let i = 0; i < a; i++) {
      const temp = [];
      for (let j = 0; j < b; j++) {
        temp.push([]);
      }
      arr.push(temp);
    }

    for (let i = 0; i < a; i++) {
      for (let j = 0; j < b; j++) {
        arr[i][j] = ' ';
      }
    }

    let k = 0;

    for (let j = 0; j < a; j++) {
      for (let i = 0; i < b; i++) {
        if (k < l) {
          arr[j][i] = s[k];
        }
        k++;
      }
    }

    for (let j = 0; j < b; j++) {
      for (let i = 0; i < a; i++) {
        encrypted = encrypted + arr[i][j];
      }
    }
    return encrypted;
  }

  static decryption(encrypted: string) {
    const l = encrypted.length;
    const b = Math.ceil(Math.sqrt(l));
    const a = Math.floor(Math.sqrt(l));
    let decrypted = '';

    const arr = [];

    for (let i = 0; i < a; i++) {
      const temp = [];
      for (let j = 0; j < b; j++) {
        temp.push([]);
      }
      arr.push(temp);
    }

    let k = 0;

    for (let j = 0; j < b; j++) {
      for (let i = 0; i < a; i++) {
        if (k < l) {
          arr[i][j] = encrypted[k];
        }
        k++;
      }
    }

    for (let i = 0; i < a; i++) {
      for (let j = 0; j < b; j++) {
        decrypted = decrypted + arr[i][j];
      }
    }

    return decrypted.trim();
  }
}
