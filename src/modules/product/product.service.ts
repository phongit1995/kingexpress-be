import { Injectable } from '@nestjs/common';
import { RequestService } from 'src/shared/services/request.service';
import Cheerio from 'cheerio';
import { Product, ProductDto } from './dto/product.dto';

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

  async getDetailProduct(id: string) {
    const res: Product = {};
    const urtProduct = `https://page.auctions.yahoo.co.jp/jp/auction/${id}`;
    const result = await this.requestService.getMethod<string>(
      encodeURI(urtProduct),
    );
    const $ = Cheerio.load(result);

    res.id = id;
    res.name = $('#ProductTitle > .ProductTitle__title > h1').text();
    res.currentPrice = parseFloat($('dd.Price__value').text());
    res.quantity = parseInt(
      $(
        '.ProductDetail > .ProductDetail__body > .l-container > .l-left > ul > li:nth-child(1) > dl > dd',
      )
        .text()
        .slice(1),
    );
    res.startingPrice = parseFloat(
      $(
        '.ProductDetail > .ProductDetail__body > .l-container > .l-right > ul > li:nth-child(5) > dl > dd',
      )
        .text()
        .slice(1),
    );

    res.images = [];
    const imagesElement = $('.ProductImage__thumbnail');
    console.log(imagesElement);
    imagesElement.each(function () {
      const element = Cheerio.load(this);
      res.images.push(element('a > img').attr('src'));
    });

    res.startDateAndTime = $(
      '.ProductDetail > .ProductDetail__body > .l-container > .l-left > ul > li:nth-child(2) > dl > dd',
    )
      .text()
      .slice(1);
    res.endDateAndTime = $(
      '.ProductDetail > .ProductDetail__body > .l-container > .l-left > ul > li:nth-child(3) > dl > dd',
    )
      .text()
      .slice(1);

    return res;
  }
}
