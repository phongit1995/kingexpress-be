import { Injectable } from '@nestjs/common';
import { RequestService } from 'src/shared/services/request.service';
import Cheerio from 'cheerio';
import { ProductOfCategoryDto } from './dto/product-of-category.dto';

@Injectable()
export class ShoppingService {
  constructor(private requestService: RequestService) {}

  async getProductByCateGory(idCat: string, page: number) {
    let price: number;
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

    listItems.each(function () {
      const element = Cheerio.load(this);
      const checkSale = element('div > div:nth-child(2) > div > p');
      console.log(checkSale.length);
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

      results.push({ name, price, image, url });
    });
    return results;
  }
}
