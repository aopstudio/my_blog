import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  Param,
  Post,
  Put,
  Del,
  Query,
} from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Between, LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { Article } from '../entity/article';
import { TagArticle } from '../entity/tag_article';
import { ArticleInfo } from '../interface';

@Controller('/article')
export class ArticleController {
  @InjectEntityModel(Article)
  articleModel: Repository<Article>;
  @InjectEntityModel(TagArticle)
  tagArticleModel: Repository<TagArticle>;
  @Inject()
  ctx: Context;

  @Post('/')
  @HttpCode(201)
  async create(@Body() newArticle: ArticleInfo) {
    const article = await this.articleModel.save(newArticle);
    const { id: article_id, tags } = article;
    const tagList = tags.split(';');
    for (const tag of tagList) {
      const newTagArticle = {
        tag,
        article_id,
      };
      this.tagArticleModel.save(newTagArticle);
    }
    this.ctx.body = {
      data: { article_id },
    };
  }

  @Get('/:id')
  async show(@Param('id') id: number) {
    const article = await this.articleModel.findOneBy({ id });
    this.ctx.body = {
      data: article,
    };
  }

  @Get('/')
  async index(@Query() articleQuery) {
    const {
      author,
      title,
      create_after,
      create_before,
      limit = 10,
      tag,
      page = 1,
    } = articleQuery;
    const where: any = {};
    if (tag) {
      const article_ids_obj = await this.tagArticleModel.find({
        select: ['article_id'],
        where: { tag },
      });
      const article_ids = article_ids_obj.map(a => a.article_id);
      where.id = article_ids;
    }
    if (author) {
      where.author = author;
    }
    if (title) {
      where.title = title;
    }
    let after_flag = 0;
    if (create_after) {
      where.create_at = MoreThanOrEqual(create_after);
      after_flag = 1;
    }
    if (create_before) {
      if (after_flag) {
        where.create_at = Between(create_after, create_before);
      } else {
        where.create_at = LessThanOrEqual(create_before);
      }
    }
    const articleInfo = await this.articleModel.findAndCount({
      where,
      order: { create_at: 'DESC' },
      take: limit,
      skip: (page - 1) * limit,
    });
    this.ctx.body = {
      data: articleInfo[0],
      meta: {
        page,
        limit,
        count: articleInfo[1],
      },
    };
  }

  @Put('/:id')
  @HttpCode(204)
  async update(@Param('id') id: number, @Body() articleInfo: ArticleInfo) {
    const { author, title, content, tags } = articleInfo;
    const article = await this.articleModel.findOneBy({ id });
    if (author) {
      article.author = author;
    }
    if (title) {
      article.title = title;
    }
    if (content) {
      article.content = content;
    }
    if (tags) {
      article.tags = tags;
    }
    await this.articleModel.save(article);
    this.ctx.status = 204;
  }

  @Del('/:id')
  async destroy(@Param('id') id: number) {
    await this.articleModel.delete({ id });
    this.ctx.status = 204;
  }
}
