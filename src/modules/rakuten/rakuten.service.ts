/* eslint-disable max-len */
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import Cheerio from 'cheerio';
@Injectable()
export class RakutenService {
  constructor(private readonly httpService: HttpService) {}
  async getListProductByCategory(categoryId: string, page = 1) {
    const urlGetCategory = `https://search.rakuten.co.jp/search/mall/-/${categoryId}/?p=${page}`;
    const { data } = await firstValueFrom(this.httpService.get(urlGetCategory));
    const $ = Cheerio.load(data);
    const regExp = /\(([^()]*)\)/g;
    const totalItemElement = $(
      '#root > div.dui-container.nav > div.dui-container.infobar > div > div.item.breadcrumb-model.breadcrumb.-fluid > div > span.count._medium',
    ).text();
    console.log(totalItemElement);
    const totalItem = regExp.exec(totalItemElement);
    console.log(totalItem);
    return data;
  }
}
