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

@Controller('/article')
export class ArticleController {
  @InjectEntityModel(Article)
  articleModel: Repository<Article>;
  @Inject()
  ctx: Context;

  @Post('/')
  @HttpCode(201)
  async addArticle(@Body() newArticle) {
    const article = await this.articleModel.save(newArticle);
    this.ctx.body = {
      data: { articleId: article.id },
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
  async updateArticleById(@Param('id') id: number, @Body() articleInfo) {
    const { author, title, content, tag } = articleInfo;
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
    if (tag) {
      article.tag = tag;
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
