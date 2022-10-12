/* eslint-disable max-len */
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import Cheerio from 'cheerio';
import * as Url from 'url';
@Injectable()
export class RakutenService {
  constructor(private readonly httpService: HttpService) {}
  async getListProductByCategory(categoryId: string, page = 1) {
    const pageSize = 30;
    const urlGetCategory = `https://janbox.com/vi/rakuten/r-${categoryId}?pageSize=${pageSize}&page=${page}`;
    const { data } = await firstValueFrom<any>(this.httpService.get(urlGetCategory));
    const $ = Cheerio.load(data);
    const products: Array<any> = [];
    const urlLast = $('#page_rakuten > div.container > div > div > nav > ul > li.page-item.page-item__last > a').attr(
      'href',
    );
    const totalPage = Url.parse(urlLast, true).query.page as string;
    $('#page_rakuten > div.container > div > div > div.row > div').each(function () {
      const element = Cheerio.load(this);
      const image = element('div > div.product_item__price > a').data('image');
      const name = element('div > div.product_item__price > a').data('title');
      const price = element('div > div.product_item__price > a').data('price');
      const productId = element('div > div.product_item__price > a').data('id');
      products.push({
        image,
        name,
        price,
        productId,
      });
    });
    return {
      results: products,
      page,
      totalPage: parseInt(totalPage),
      pageSize,
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
