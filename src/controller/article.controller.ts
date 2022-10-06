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
} from '@midwayjs/decorator';
import { Context } from '@midwayjs/koa';
import { InjectEntityModel } from '@midwayjs/typeorm';
import { Repository } from 'typeorm';
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
  async addArticle(@Body() newArticle: ArticleInfo) {
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
  async getArticleById(@Param('id') id: number) {
    const article = await this.articleModel.findOneBy({ id });
    this.ctx.body = {
      data: article,
    };
  }

  @Put('/:id')
  @HttpCode(204)
  async updateArticleById(
    @Param('id') id: number,
    @Body() articleInfo: ArticleInfo
  ) {
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
  async deleteArticleById(@Param('id') id: number) {
    await this.articleModel.delete({ id });
    this.ctx.status = 204;
  }
}
