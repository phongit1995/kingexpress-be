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
    console.log(urlGetCategory);
    const { data } = await firstValueFrom<any>(this.httpService.get(urlGetCategory));
    const $ = Cheerio.load(data);
    const regExp = /\(([^()]*)\)/g;
    const totalItemElement = $(
      '#root > div.dui-container.nav > div.dui-container.infobar > div > div.item.breadcrumb-model.breadcrumb.-fluid > div > span.count._medium',
    ).text();
    console.log(totalItemElement);
    const totalItem = regExp.exec(totalItemElement);
    console.log(totalItem);
    const listProductsElement = $(
      '#root > div.dui-container.main > div.dui-container.content > div.dui-container.searchresults > div > div.searchresultitem',
    );
    const listProducts: Array<any> = [];
    console.log('listProductsElement', listProductsElement.length);
    listProductsElement.each(function () {
      const element = Cheerio.load(this);
      const image = element('div.image > a > img').attr('src');
      const url = element('div.image > a ').attr('href');
      const price = parseInt(
        element('div.content.description.price > span.important').text().replace('円', '').replace(',', ''),
      );
      console.log(price);
      console.log('image', image);
      console.log('url', url);
      listProducts.push({
        image,
        price,
        url,
      });
    });
    return {
      results: listProducts,
      totalProduct: totalItem,
      pageSize: 50,
    };
  }
}
