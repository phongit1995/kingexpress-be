import { Injectable } from '@nestjs/common';
import { RequestService } from 'src/shared/services/request.service';
import Cheerio from 'cheerio';

@Injectable()
export class ProductService {
  constructor(private requestService: RequestService) {}
  private urlSuggest =
    'https://auctions.yahoo.co.jp/category/list/23140/?p=アクセサリー、時計&auccat=23140&exflg=1&b=1&n=20&s1=featured&o1=d&nockie=1';
  async listSuggest() {
    const result = await this.requestService.getMethod<string>(
      encodeURI(this.urlSuggest),
    );
    const $ = Cheerio.load(result);
    const listProductElement = $(
      '#allContents > div.l-wrapper.cf > div.l-contents > div.l-contentsMain > div.l-contentsBody > div > div.Result__body > div.Products.Products--grid > div > ul > li',
    );
    const listProduct: any[] = [];
    listProductElement.each(function () {
      const element = Cheerio.load(this);
      const image = element('.Product__image > a >img').attr('src');
      const title = element('.Product__detail > .Product__title >a').text();
      const id = element('.Product__detail > .Product__bonus').data(
        'auction-id',
      );
      const endTime = element('.Product__detail > .Product__bonus').data(
        'auction-endtime',
      );
      const buyNowPrice = element('.Product__detail > .Product__bonus').data(
        'auction-buynowprice',
      );
      const price = element('.Product__detail > .Product__bonus').data(
        'auction-price',
      );
      const bid = element('.Product__bid').text();
      listProduct.push({
        image,
        title,
        id,
        endTime,
        buyNowPrice,
        price,
        bid: parseInt(bid),
      });
    });
    return listProduct;
  }
}
