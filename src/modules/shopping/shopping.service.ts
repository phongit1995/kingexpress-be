import { Injectable } from '@nestjs/common';
import { RequestService } from 'src/shared/services/request.service';
import Cheerio from 'cheerio';
import { ProductOfCategoryDto } from './dto/product-of-category.dto';

@Injectable()
export class ShoppingService {
  constructor(private requestService: RequestService) {}

  async getProductByCateGory(idCat: string, page: number) {
    const results: ProductOfCategoryDto[] = [];
    const urlCat = `https://shopping.yahoo.co.jp/category/${idCat}/list?b=${
      (page - 1) * 30 + 1
    }&view=grid`;
    const result = await this.requestService.getMethod<string>(
      encodeURI(urlCat),
    );
    const $ = Cheerio.load(result);
    const listItems = $(
      `#searchResults${page} > div[data-result-type='items'] > ul > li`,
    );
    const totalProduct = parseInt(
      $(
        '#shpWrapper > main > div.Column._3RZ4M6_sP6nw > div.Column__center._3MLJRzRderwL > div.WaEFXzO1gxUR._11KpetFzYHvU > div._2EvXo2XYUZfp > p',
      )
        .text()
        .replace(',', '')
        .replace(',', ''),
    );

    listItems.each(function () {
      let price: number;
      let slugProduct: string;
      let slugShop: string;
      const element = Cheerio.load(this);
      const checkSale = element('div > div:nth-child(2) > div > p');

      if (checkSale.length === 2) {
        price = parseFloat(
          element(
            'div > div:nth-child(2) > div > p:nth-child(2) > span:first-child',
          )
            .text()
            .replace(',', ''),
        );
      } else if (checkSale.length === 1) {
        price = parseFloat(
          element(
            'div > div:nth-child(2) > div > p:first-child > span:first-child',
          )
            .text()
            .replace(',', ''),
        );
      }

      const name = element('div > div:nth-child(2) > p > a > span').text();
      const image = element('div > div:first-child > a > img').attr('src');
      const url = element('div > div:first-child > a').attr('href');

      if (url.includes('https://store.shopping.yahoo.co.jp/')) {
        const arr = url.split('/');
        slugShop = arr[3];
        slugProduct = arr[4].slice(0, arr[4].lastIndexOf('.html'));
      }
      if (url.includes('https://paypaymall.yahoo.co.jp/')) {
        slugShop = url.split('/')[4];
        slugProduct = url.split('/')[6];
      }

      results.push({ name, price, image, url, slugShop, slugProduct });
    });
    return { results, totalProduct, pageSize: 30 };
  }
}
