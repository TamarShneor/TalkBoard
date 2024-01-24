import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from 'src/schemas/category.schema';

@Injectable()
export class CategoryService {

    constructor(@InjectModel(Category.name) private categoryModel: Model<Category>) { }

    async getAll(): Promise<Category[]> {
        return await this.categoryModel.find().exec()
    }

    async create(category: Category) {
        const newCategory = await new this.categoryModel(category);
        return newCategory.save();
    }

}
