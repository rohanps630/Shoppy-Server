import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseRequest } from '../base.request';
import { IsNumberString, IsOptional, IsString } from 'class-validator';
import { SortValues } from 'mongoose';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
  ASCENDING = 'ascending',
  DESCENDING = 'descending',
}

export function convertToNumericSortOrder(order: SortOrder): 1 | -1 {
  switch (order) {
    case SortOrder.ASC:
    case SortOrder.ASCENDING:
      return 1;
    case SortOrder.DESC:
    case SortOrder.DESCENDING:
      return -1;
  }
}

export class ResponseOK {
  @ApiProperty({ type: String, description: 'Response OK', default: 'OK' })
  public readonly message: string;

  public constructor(message: string) {
    this.message = message || 'OK';
  }

  public static of(message?: string): ResponseOK {
    return new ResponseOK(message);
  }
}

export class Pagination extends BaseRequest {
  @ApiProperty({ type: Number, description: 'page', default: 0 })
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  public readonly page: number;
  @ApiProperty({ type: Number, description: 'limit', default: 10 })
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumberString()
  public readonly limit: number;
  @ApiProperty({ enum: SortOrder, description: 'sortOrder', default: SortOrder.DESC })
  @IsOptional()
  @IsString()
  public readonly sortOrder: SortOrder;
  @ApiProperty({ type: String, description: 'sortBy' })
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public readonly sortBy: string;
}

export class UserIdQuery extends BaseRequest {
  @ApiProperty({ type: String, description: 'userId' })
  @ApiPropertyOptional()
  public readonly userId: string;
}

export class ListRequest<T> {
  public list: T[];
}

function _toObject(value: any) {
  try {
    if (typeof value == 'object') {
      return value;
    }

    return JSON.parse(value);
  } catch (error) {}

  return value;
}

export class KeyValuePair<K, V> {
  private constructor(
    public key: K,
    public value: V,
    public message?: string,
  ) {}

  public static of<K, V>(key: K, value: V, isMessageRequired: boolean = false) {
    if (isMessageRequired) {
      const msg: string = key.toString();
      return new KeyValuePair(key, value, msg);
    }
    return new KeyValuePair(key, value);
  }

  public static copyFrom<K, V>(value: any): KeyValuePair<K, V> {
    if (!value) return null;

    value = _toObject(value);

    if (typeof value != 'object') {
      return value;
    }

    return new KeyValuePair(value['key'], value['message'], value['value']);
  }
}

export class ListResponse<T> {
  public list: T[];

  public constructor(list?: T[]) {
    if (list != null) {
      this.list = list;
    } else {
      this.list = [];
    }
  }

  public static of<T>(list?: T[]): ListResponse<T> {
    return new ListResponse<T>(list);
  }

  public addOne(item: T): ListResponse<T> {
    if (!item) {
      return this;
    }

    this.list.push(item);
    return this;
  }

  public addAll(list: T[]): ListResponse<T> {
    if (!list || list.length == 0) {
      return this;
    }

    list.map((element) => this.list.push(element));

    return this;
  }
}

export class RepoPagination {
  public readonly page: number;
  public readonly limit: number;
  public readonly skip: number;
  public readonly sort: { [key: string]: SortValues } = {};

  private constructor(page: number, skip: number, limit: number, sort: { [key: string]: SortValues }) {
    this.page = Number(page);
    this.skip = Number(skip);
    this.limit = Number(limit);
    this.sort = sort;
  }

  static of(pagination: Pagination) {
    const page = pagination.page ?? 1;
    const limit = pagination.limit ?? 10;
    const skip_ = (page - 1) * limit;
    const sort: { [key: string]: SortValues } = {};
    if (pagination.sortBy && pagination.sortOrder) {
      sort[pagination.sortBy] = convertToNumericSortOrder(pagination.sortOrder);
    }

    return new RepoPagination(page, skip_, limit, sort);
  }
}

export class PaginationResponse<T> {
  page: number;
  limit: number;
  total: number;
  public list: T[];

  public static builder() {
    return new PaginationResponse.Builder();
  }

  public toBuilder() {
    const builder = PaginationResponse.builder();
    if (!this.list) this.list = [];

    builder.list = ListResponse.of(this.list).list;
    builder.page = this.page;
    builder.limit = this.limit;
    builder.total = this.total;

    return builder;
  }

  public static Builder = class {
    page: number;
    limit: number;
    total: number;
    list: any[];

    public setPage(page: number) {
      this.page = page;
      return this;
    }

    public setLimit(limit: number) {
      this.limit = limit;
      return this;
    }

    public setCount(total: number) {
      this.total = total;
      return this;
    }

    public setList<T>(list: T[]) {
      this.list = list;
      return this;
    }

    public build<T>(): PaginationResponse<T> {
      if (!this.list) this.list = [];
      if (!this.page) this.page = 1;

      const pagination = new PaginationResponse<T>();

      pagination.list = ListResponse.of(this.list).list;
      pagination.page = this.page;
      pagination.limit = this.limit;
      pagination.total = this.total;

      return pagination;
    }
  };
}
