import { Injectable } from '@nestjs/common';
import { RequestService } from 'src/shared/services/request.service';
import Cheerio from 'cheerio';
import { ProductDetail } from './dto/product.dto';
import * as moment from 'moment';
moment.locale('ja');

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

  async getDetailProduct(id: string): Promise<ProductDetail> {
    const urtProduct = `https://page.auctions.yahoo.co.jp/jp/auction/${id}`;
    const result = await this.requestService.getMethod<string>(
      encodeURI(urtProduct),
    );
    const $ = Cheerio.load(result);
    const name = $('#ProductTitle > .ProductTitle__title > h1').text();
    const currentPrice = parseInt($('dd.Price__value').text().replace(',', ''));
    const quantity = parseInt(
      $(
        '.ProductDetail > .ProductDetail__body > .l-container > .l-left > ul > li:nth-child(1) > dl > dd',
      )
        .text()
        .slice(1),
    );
    const startingPrice = parseFloat(
      $(
        '.ProductDetail > .ProductDetail__body > .l-container > .l-right > ul > li:nth-child(5) > dl > dd',
      )
        .text()
        .slice(1),
    );
    const images: string[] = [];
    const imagesElement = $('.ProductImage__thumbnail');
    imagesElement.each(function () {
      const element = Cheerio.load(this);
      images.push(element('a > img').attr('src'));
    });
    const nameSeller = $('.Seller__name > a').text();
    const urlSeller = $('.Seller__name > a').attr('href');

    const startDateAndTime = $(
      '.ProductDetail > .ProductDetail__body > .l-container > .l-left > ul > li:nth-child(2) > dl > dd',
    )
      .text()
      .slice(1);
    const endDateAndTime = $(
      '.ProductDetail > .ProductDetail__body > .l-container > .l-left > ul > li:nth-child(3) > dl > dd',
    )
      .text()
      .slice(1);
    const automationExtension = $(
      '.ProductDetail > .ProductDetail__body > .l-container > div.l-left > ul > li:nth-child(4) > dl > dd',
    )
      .text()
      .replace('：', '')
      .trim();
    const earlyTermination = $(
      '.ProductDetail > .ProductDetail__body > .l-container > div.l-left > ul > li:nth-child(5) > dl > dd',
    )
      .text()
      .replace('：', '')
      .trim();
    const refund = $(
      '.ProductDetail > .ProductDetail__body > .l-container > div.l-right > ul > li:nth-child(1) > dl > dd',
    )
      .text()
      .replace('：', '')
      .trim();
    const bidderAppraisalRestriction = $(
      '.ProductDetail > .ProductDetail__body > .l-container > div.l-right > ul > li:nth-child(2) > dl > dd',
    )
      .text()
      .replace('：', '')
      .trim();
    const bidderVerificationLimit = $(
      '.ProductDetail > .ProductDetail__body > .l-container > div.l-right > ul > li:nth-child(3) > dl > dd',
    )
      .text()
      .replace('：', '')
      .trim();
    const productRelation = [];
    const productRelationContainer = $('#recommendTop > div > ul > li');
    productRelationContainer.each(function () {
      const element = Cheerio.load(this);
      const image = element('div > div > a > img').attr('src');
      const name = element('div > div > a > img').attr('alt');
      const id = element('div > div > div > a').attr('data-aid');
      const price = element(
        'div > a > p.ProductItem__price > span.ProductItem__priceValue.ProductItem__priceValue--current',
      )
        .text()
        .replace('円', '')
        .replace(',', '');
      productRelation.push({
        image,
        name,
        price: Number(price),
        id,
      });
    });
    return {
      detail: {
        name,
        currentPrice,
        quantity,
        images,
        nameSeller,
        urlSeller,
        startingPrice,
        startDateAndTime: moment(
          startDateAndTime,
          'YYYY.MM.DD (dd) mm:ss',
        ).unix(),
        endDateAndTime: moment(endDateAndTime, 'YYYY.MM.DD (dd) mm:ss').unix(),
        automationExtension: automationExtension == 'あり' ? true : false,
        earlyTermination: earlyTermination == 'あり' ? true : false,
        refund: refund == '返品不可' ? false : true,
        bidderAppraisalRestriction:
          bidderAppraisalRestriction == 'あり' ? true : false,
        bidderVerificationLimit:
          bidderVerificationLimit == 'なし' ? false : true,
        highestBidder: null,
        id,
      },
      productRelation,
    };
  }

  async searchProduct(key: string, page: number, pageSize: number) {
    const urlTranslate = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=vi&tl=ja&dt=t&q=${key}`;
    const result: any = {};
    result.product = [];
    const resJapanese = await this.requestService.postMethod<string>(
      encodeURI(urlTranslate),
    );
    const keyJapan = JSON.parse(resJapanese)[0][0][0];

    const urlMain = `https://auctions.yahoo.co.jp/search/search?p=${keyJapan}`;
    const url = `https://auctions.yahoo.co.jp/search/search?p=${keyJapan}&va=${keyJapan}&fixed=2&exflg=1&b=${
      (page - 1) * pageSize + 1
    }&n=${pageSize}`;
    const [resultMain, res] = await Promise.all([
      this.requestService.getMethod<string>(encodeURI(urlMain)),
      this.requestService.getMethod<string>(encodeURI(url)),
    ]);
    const main = Cheerio.load(resultMain);
    result.totalProduct = parseInt(
      main(
        '.SearchMode > .Tab > .Tab__items > li:nth-child(2) > a > .Tab__subText',
      )
        .text()
        .replace(',', ''),
    );

    const $ = Cheerio.load(res);
    const listItem = $(
      '.Result > .Result__body > .Products.Products--grid > .Products__list > ul > li',
    );

    listItem.each(function () {
      const element = Cheerio.load(this);
      const item: any = {};
      item.id = element('.Product__detail > .Product__bonus').data(
        'auction-id',
      );
      item.imageUrl = element('.Product__image > a > img').attr('src');
      item.name = element('.Product__detail > h3 > a').text();
      item.price = element('.Product__detail > .Product__bonus').data(
        'auction-price',
      );
      item.productUrl = element('.Product__detail > h3 > a').attr('href');
      item.endTime = element('.Product__detail > .Product__bonus').data(
        'auction-endtime',
      );
      item.buyNowPrice = element('.Product__detail > .Product__bonus').data(
        'auction-buynowprice',
      );
      item.startPrice = element('.Product__detail > .Product__bonus').data(
        'auction-startprice',
      );
      result.product.push(item);
    });
    return result;
  }
}
