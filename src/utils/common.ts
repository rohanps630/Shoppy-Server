/* eslint-disable prettier/prettier */
import { isBoolean, isBooleanString } from 'class-validator';

export const stringify = (value: any) => {
  if (!value) return null;

  try {
    if (value instanceof Object) {
      return JSON.stringify(value);
    }

    return value;
  } catch (error) {
    return value;
  }
};

export const converToBoolean = (value: any) => {
  if (!value) return null;

  try {
    if (isBoolean(value)) return value;
    if (!isBooleanString(value)) return null;
    if (value == 'true') return true;
    if (value == 'false') return false;
  } catch (error) {
    return null;
  }

  return null;
};

export const stringifySafe = (value: any) => {
  if (!value) return 'null';

  try {
    if (value instanceof Object) {
      return JSON.stringify(value);
    } else {
      return value;
    }
  } catch (error) {
    try {
      let indent = 2;
      let cache = [];
      const retVal = JSON.stringify(
        value,
        (key, value) =>
          typeof value === 'object' && value !== null
            ? cache.includes(value)
              ? undefined
              : cache.push(value) && value
            : value,
        indent
      );
      cache = null;
      return retVal;
    } catch (error) {
      return value;
    }
  }
};

export const parseSafe = (value: any) => {
  if (!value) return 'null';

  try {
    return JSON.parse(value);
  } catch (error) {
    return value;
  }
};

export const classNameOf = (cls: any) => {
  if (!cls) return '';

  try {
    if (cls instanceof Object) {
      return cls.constructor.name;
    } else {
      return cls;
    }
  } catch (error) {
    return cls;
  }
};

export const delay = async (retryDelayInMilli: number) => {
  return new Promise((resolve) => setTimeout(resolve, retryDelayInMilli));
};

export const trimmedOf = (value: String | string) => {
  if (!value) return null;

  try {
    let val = stringify(value) + '';

    return val.trim();
  } catch (error) {
    return value;
  }
};

export const isEmpty = (value: String | string) => {
  if (!value) return true;

  try {
    let val = trimmedOf(value);

    if (val && val != '') {
      return false;
    } else {
      return true;
    }
  } catch (error) {
    return true;
  }
};

export const isNotEmpty = (value: String | string) => {
  let val = isEmpty(value);

  if (val == true) {
    return false;
  } else {
    return true;
  }
};

export const isEqual = (s1: String | string, s2: String | string) => {
  s1 = trimmedOf(s1);
  s2 = trimmedOf(s2);

  if (s1 == s2) {
    return true;
  } else {
    return false;
  }
};

export const isNotEqual = (s1: String | string, s2: String | string) => {
  let val = isEqual(s1, s2);

  if (val == true) {
    return false;
  } else {
    return true;
  }
};

export const listContains = (list: string[], value: string) => {
  if (!value) return false;
  if (!list) list = [];

  for (let i = 0; i < list.length; i++) {
    if (list[i] == value) {
      return true;
    }
  }

  return false;
};
export const wait = async (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
export const generateNumberBetween = (start: number, end: number) => {
  if (!start || !end) return 0;
  if (start >= end) return 0;
  return Math.floor(Math.random() * (end - start + 1) + 5);
};
export const createFense = async (time = 5) => {
  await wait(time);
};
