/* eslint-disable max-len */
import { Injectable, HttpException } from '@nestjs/common';
import { RequestService } from 'src/shared/services/request.service';
import Cheerio from 'cheerio';
import { ProductDetail } from './dto/product.dto';
import * as moment from 'moment';
import { LastOrderProductDto } from './dto/last-order.dto';
moment.locale('ja');

@Injectable()
export class ProductService {
  constructor(private requestService: RequestService) {}
  private readonly baseUrl = 'https://api.kimlongexpress.vn';
  private urlSuggest =
    // eslint-disable-next-line max-len
    'https://auctions.yahoo.co.jp/category/list/23140/?p=アクセサリー、時計&auccat=23140&exflg=1&b=1&n=20&s1=featured&o1=d&nockie=1';
  async listProductCategory(categoryId: string) {
    const urlCategory = `https://auctions.yahoo.co.jp/category/list/${categoryId}/?p=アクセサリー、時計&auccat=23140&exflg=1&b=1&n=20&s1=featured&o1=d&nockie=1`;
    const result = await this.requestService.getMethod<string>(encodeURI(urlCategory));
    const $ = Cheerio.load(result);
    const listProductElement = $(
      // eslint-disable-next-line max-len
      '#allContents > div.l-wrapper.cf > div.l-contents > div.l-contentsMain > div.l-contentsBody > div > div.Result__body > div.Products.Products--grid > div > ul > li',
    );
    const listProduct: any[] = [];
    listProductElement.each(function () {
      const element = Cheerio.load(this);
      const image = element('.Product__image > a >img').attr('src');
      const title = element('.Product__detail > .Product__title >a').text();
      const id = element('.Product__detail > .Product__bonus').data('auction-id');
      const endTime = element('.Product__detail > .Product__bonus').data('auction-endtime');
      const buyNowPrice = element('.Product__detail > .Product__bonus').data('auction-buynowprice');
      const price = element('.Product__detail > .Product__bonus').data('auction-price');
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
    const urlProduct = `https://page.auctions.yahoo.co.jp/jp/auction/${id}`;
    const result = await this.requestService.getMethod<string>(encodeURI(urlProduct));
    const timeLeft = await this.getTimeLefProduct(id);
    const $ = Cheerio.load(result);
    const name = $('#ProductTitle > .ProductTitle__title > h1').text();
    const currentPrice = parseInt($('dd.Price__value').text().replace(',', ''));
    const quantity = parseInt(
      $('.ProductDetail > .ProductDetail__body > .l-container > .l-left > ul > li:nth-child(1) > dl > dd')
        .text()
        .slice(1),
    );
    const description = $(
      '#adoc > div.ProductExplanation__body.highlightWordSearch > div.ProductExplanation__commentArea',
    ).html();
    const startingPrice = parseFloat(
      $('.ProductDetail > .ProductDetail__body > .l-container > .l-right > ul > li:nth-child(5) > dl > dd')
        .text()
        .slice(1),
    );
    const images: string[] = [];
    const imagesElement = $('.ProductImage__image');
    imagesElement.each(function () {
      const element = Cheerio.load(this);
      images.push(element('div > img').attr('src'));
    });
    const nameSeller = $('.Seller__name > a').text();
    const urlSeller = $('.Seller__name > a').attr('href');
    const countAuction = $(
      '#l-sub > div.ProductInformation > ul > li.ProductInformation__item.js-stickyNavigation-start > div.Price > div.Price__borderBox > div.Count > ul > li:nth-child(1) > dl > dd',
    )
      .children()
      .remove()
      .end()
      .text();
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
        description,
        urlSeller,
        startingPrice,
        startDateAndTime: moment(startDateAndTime, 'YYYY.MM.DD (dd) mm:ss').unix(),
        endDateAndTime: moment(endDateAndTime, 'YYYY.MM.DD (dd) mm:ss').unix(),
        automationExtension: automationExtension == 'あり' ? true : false,
        earlyTermination: earlyTermination == 'あり' ? true : false,
        refund: refund == '返品不可' ? false : true,
        bidderAppraisalRestriction: bidderAppraisalRestriction == 'あり' ? true : false,
        bidderVerificationLimit: bidderVerificationLimit == 'なし' ? false : true,
        highestBidder: null,
        id,
        timeLeft: Number(timeLeft),
        url: urlProduct,
        countAuction: Number(countAuction),
      },
      productRelation,
    };
  }

  async searchProduct(
    key: string,
    page: number,
    pageSize: number,
    min: number,
    max: number,
    priceType: number,
    status: number,
  ) {
    const urlTranslate = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=vi&tl=ja&dt=t&q=${key}`;
    const result: any = {};
    result.product = [];
    const resJapanese = await this.requestService.postMethod<string>(encodeURI(urlTranslate));
    const keyJapan = JSON.parse(resJapanese)[0][0][0];

    let url = `https://auctions.yahoo.co.jp/search/search`;
    if (keyJapan) {
      url += `?p=${keyJapan}&va=${keyJapan}&fixed=2&exflg=1`;
    }
    if (page || page === 0) {
      url += `&b=${(page - 1) * pageSize + 1}`;
    }
    if (pageSize || pageSize === 0) {
      url += `&n=${pageSize}`;
    }
    if (min || min === 0) {
      url += `&min=${min}`;
    }
    if (max || max === 0) {
      url += `&max=${max}`;
    }
    if (priceType || priceType === 1) {
      url += `&price_type=currentprice`;
    }
    if (priceType || priceType === 2) {
      url += `&price_type=bidorbuyprice`;
    }
    if (status || status === 1) {
      url += `&new=1`;
    }
    const res = await this.requestService.getMethod<string>(encodeURI(url));
    const $ = Cheerio.load(res);
    const totalProduct = parseInt(
      $('.SearchMode > .Tab > .Tab__items > li:nth-child(2) > .Tab__itemInner > .Tab__subText').text().replace(',', ''),
    );
    const listItem = $('.Result > .Result__body > .Products.Products--grid > .Products__list > ul > li');

    listItem.each(function () {
      const element = Cheerio.load(this);
      const item: any = {};
      item.id = element('.Product__detail > .Product__bonus').data('auction-id');
      item.image = element('.Product__image > a > img').attr('src');
      item.name = element('.Product__detail > h3 > a').text();
      item.price = element('.Product__detail > .Product__bonus').data('auction-price');
      item.url = element('.Product__detail > h3 > a').attr('href');
      item.endTime = element('.Product__detail > .Product__bonus').data('auction-endtime');
      item.buyNowPrice = element('.Product__detail > .Product__bonus').data('auction-buynowprice');
      item.startPrice = element('.Product__detail > .Product__bonus').data('auction-startprice');
      result.product.push(item);
    });
    return {
      ...result,
      totalProduct: totalProduct || 0,
    };
  }
  async getTimeLefProduct(productId: string): Promise<number> {
    const urlParse = new URL('https://page.auctions.yahoo.co.jp/now');
    urlParse.searchParams.set('aID', productId);
    urlParse.searchParams.set('nowtime', new Date().getTime().toString());
    return this.requestService.getMethod<number>(urlParse.toString());
  }

  async lastOrderProduct(token: string, lastOrderProductDto: LastOrderProductDto) {
    const urlLastOrder = `${this.baseUrl}/api/yahoo_action/yeucaudaugia`;
    try {
      const result = await this.requestService.postMethod(urlLastOrder, {
        headers: {
          authorization: token,
        },
        body: {
          ...lastOrderProductDto,
        },
        json: true,
      });
      return result;
    } catch (error) {
      console.log('error', error);
      throw new HttpException(error.error?.message, error.statusCode || 400);
    }
  }
}
