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
    const { data } = await firstValueFrom<any>(this.httpService.get(urlGetCategory));
    const $ = Cheerio.load(data);
    const totalItemElement = $(
      '#root > div.dui-container.nav > div.dui-container.infobar > div > div.item.breadcrumb-model.breadcrumb.-fluid > div > span.count._medium',
    )
      .text()
      .replace(',', '')
      .split('（');
    const totalItem = totalItemElement[1].replace('件）', '');
    const listProductsElement = $(
      '#root > div.dui-container.main > div.dui-container.content > div.dui-container.searchresults > div > div.searchresultitem',
    );
    const listProducts: Array<any> = [];
    listProductsElement.each(function () {
      const element = Cheerio.load(this);
      const image = element('div.image > a > img').attr('src');
      const url = element('div.image > a ').attr('href');
      const price = parseInt(
        element('div.content.description.price > span.important').text().replace('円', '').replace(',', ''),
      );
      const name = element('div.content.title > h2 > a').attr('title');
      const urlArray = url.replace('https://', '').split('/');
      if (urlArray[0] == 'item.rakuten.co.jp') {
        listProducts.push({
          image,
          price,
          url,
          shipId: urlArray[1],
          productId: urlArray[2],
          name,
        });
      }
    });
    return {
      results: listProducts,
      totalProduct: parseInt(totalItem),
      pageSize: 50,
    };
  }

  async getListCategoryInMainPage() {
    return [
      {
        id: 215783,
        name: 'Đồ dùng gia đình',
      },
      {
        id: 216131,
        name: 'Túi xách & phụ kiện',
      },
      {
        id: 558885,
        name: 'Giày dép',
      },
      {
        id: 101070,
        name: 'Golf - Thể thao - Dã ngoại',
      },
    ];
  }
}
