import { Pagination, PaginationResponse, RepoPagination } from '@/common/models/common.models';
import { Document, FilterQuery, Model, UpdateQuery } from 'mongoose';

/**
 * Abstract class representing a generic entity repository for MongoDB using Mongoose.
 */
export abstract class EntityRepository<T extends Document> {
  constructor(protected readonly entityModel: Model<T>) {}

  /**
   * Abstract class representing a generic entity repository for MongoDB using Mongoose.
   */
  async findOne(entityFilterQuery: FilterQuery<T>, projection?: Record<string, unknown>): Promise<T | null> {
    return this.entityModel
      .findOne(entityFilterQuery, {
        _id: 0,
        __v: 0,
        ...projection,
      })
      .exec();
  }

  /**
   * Retrieve an array of documents based on the provided query.
   *
   * @param entityFilterQuery - The filter query to match multiple documents.
   * @returns An array of matching documents or an empty array if none found.
   */
  async find(entityFilterQuery: FilterQuery<T>): Promise<T[] | null> {
    return this.entityModel.find(entityFilterQuery);
  }

  /**
   * Find and return documents with pagination and optional sorting.
   *
   * @param entityFilterQuery - The filter query to match documents.
   * @param pagination - Pagination and sorting options.
   * @returns A `PaginationResponse` object containing the paginated results.
   */
  async findWithPagination(entityFilterQuery: FilterQuery<T>, pagination: Pagination): Promise<PaginationResponse<T[]>> {
    const repoPagination = RepoPagination.of(pagination);

    const data = await this.entityModel
      .find(entityFilterQuery)
      .skip(repoPagination.skip)
      .limit(repoPagination.limit)
      .sort(repoPagination.sort)
      .exec();

    const total = await this.entityModel.count(entityFilterQuery);

    const paginationResponse = PaginationResponse.builder()
      .setList<T>(data)
      .setCount(total)
      .setLimit(repoPagination.limit)
      .setPage(repoPagination.page)
      .build<T[]>();

    return paginationResponse;
  }

  /**
   * Create a new entity document with the provided data.
   *
   * @param createEntityData - Data to create the entity document.
   * @returns The created entity document.
   */
  async create(createEntityData: unknown): Promise<T> {
    const entity = new this.entityModel(createEntityData);
    const savedEntity = await entity.save();
    return savedEntity as T;
  }

  /**
   * Create multiple entity documents in bulk.
   *
   * @param createEntityData - An array of data to create multiple entity documents.
   * @returns An array of created entity documents.
   */
  async createMany(createEntityData: unknown[]): Promise<T[]> {
    const entities = createEntityData.map((data) => new this.entityModel(data));
    const savedEntities = await this.entityModel.create(entities);
    return savedEntities as T[];
  }

  /**
   * Count documents that match the provided query.
   *
   * @param entityFilterQuery - The filter query to count documents.
   * @returns The count of matching documents.
   */
  async count(entityFilterQuery: FilterQuery<T>): Promise<number> {
    return this.entityModel.countDocuments(entityFilterQuery).exec();
  }

  /**
   * Retrieve documents and their count based on a query.
   *
   * @param entityFilterQuery - The filter query to match documents.
   * @returns An object with the matching documents and their count.
   */
  async findAndCount(entityFilterQuery: FilterQuery<T>): Promise<{ entities: T[] | null; count: number }> {
    const entities = await this.find(entityFilterQuery);
    const count = await this.count(entityFilterQuery);
    return { entities, count };
  }

  /**
   * Find a document based on a query or create a new one if not found.
   *
   * @param entityFilterQuery - The filter query to find a document.
   * @param createEntityData - Data to create a new entity document if not found.
   * @returns The found or newly created entity document.
   */
  async findOneOrCreate(entityFilterQuery: FilterQuery<T>, createEntityData: unknown): Promise<T> {
    const existingEntity = await this.findOne(entityFilterQuery);
    if (existingEntity) {
      return existingEntity;
    } else {
      return this.create(createEntityData);
    }
  }

  /**
   * Update a document based on a query or create a new one if not found.
   *
   * @param entityFilterQuery - The filter query to update a document.
   * @param updateEntityData - Data to update an existing document.
   * @param createEntityData - Data to create a new entity document if not found.
   * @returns The updated or newly created entity document.
   */
  async updateOrCreate(entityFilterQuery: FilterQuery<T>, updateEntityData: UpdateQuery<unknown>, createEntityData: unknown): Promise<T> {
    const existingEntity = await this.entityModel.findOneAndUpdate(entityFilterQuery, updateEntityData);
    if (existingEntity) {
      return existingEntity;
    } else {
      return this.create(createEntityData);
    }
  }

  /**
   * Find and update a document based on a query.
   *
   * @param entityFilterQuery - The filter query to find and update a document.
   * @param updateEntityData - Data to update the found document.
   * @returns The updated document or null if not found.
   */
  async findAndUpdate(entityFilterQuery: FilterQuery<T>, updateEntityData: UpdateQuery<unknown>): Promise<T | null> {
    const existingEntity = await this.findOne(entityFilterQuery);
    if (existingEntity) {
      return this.entityModel.findOneAndUpdate(entityFilterQuery, updateEntityData);
    } else {
      return null;
    }
  }

  /**
   * Update multiple documents based on a query.
   *
   * @param entityFilterQuery - The filter query to match and update multiple documents.
   * @param updateEntityData - Data to update the matching documents.
   * @returns The count of modified documents.
   */
  async updateMany(entityFilterQuery: FilterQuery<T>, updateEntityData: UpdateQuery<unknown>): Promise<number> {
    const updateResult = await this.entityModel.updateMany(entityFilterQuery, updateEntityData);
    return updateResult.modifiedCount;
  }

  /**
   * Find and delete a document based on a query.
   *
   * @param entityFilterQuery - The filter query to find and delete a document.
   * @returns The deleted document or null if not found.
   */
  async findAndDelete(entityFilterQuery: FilterQuery<T>): Promise<T | null> {
    const existingEntity = await this.findOne(entityFilterQuery);
    if (existingEntity) {
      await this.deleteMany(entityFilterQuery);
      return existingEntity;
    } else {
      return null;
    }
  }

  /**
   * Delete multiple documents based on a query.
   *
   * @param entityFilterQuery - The filter query to match and delete multiple documents.
   * @returns The count of deleted documents.
   */
  async deleteMany(entityFilterQuery: FilterQuery<T>): Promise<number> {
    const deleteResult = await this.entityModel.deleteMany(entityFilterQuery);
    return deleteResult.deletedCount;
  }
}
