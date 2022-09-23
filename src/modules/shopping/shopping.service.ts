/* eslint-disable max-len */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { RequestService } from 'src/shared/services/request.service';
import Cheerio from 'cheerio';
import { ProductOfCategoryDto } from './dto/product-of-category.dto';
import { OrderProductShoppingDto } from './dto/order-product-shopping.dto';

@Injectable()
export class ShoppingService {
  constructor(private requestService: RequestService) {}
  private readonly baseUrl = 'https://api.kimlongexpress.vn';
  async getProductByCateGory(idCat: string, page: number) {
    const results: ProductOfCategoryDto[] = [];
    const urlCat = `https://shopping.yahoo.co.jp/category/${idCat}/list?b=${(page - 1) * 30 + 1}&view=grid`;
    const result = await this.requestService.getMethod<string>(encodeURI(urlCat));
    const $ = Cheerio.load(result);
    const listItems = $(`#searchResults${page} > div[data-result-type='items'] > ul > li`);
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
          element('div > div:nth-child(2) > div > p:nth-child(2) > span:first-child').text().replace(',', ''),
        );
      } else if (checkSale.length === 1) {
        price = parseFloat(
          element('div > div:nth-child(2) > div > p:first-child > span:first-child').text().replace(',', ''),
        );
      }

      let image;
      const name = element('div > div:nth-child(2) > p > a > span').text();
      const url = element('div > div:first-child > a').attr('href');
      image = element('div > div:first-child > a > img').attr('src');
      if (!image) {
        const contentNoneScript = element('div > div:first-child > a > span > noscript').text();
        const content = Cheerio.load(contentNoneScript);
        image = content('img').attr('src');
      }

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

  async getDetailProduct(slugShop: string, slugPro: string) {
    const infoStore = await this.getDetailProductStore(slugShop, slugPro);
    if (infoStore.name) {
      return infoStore;
    }
    const infoPaypaymall = await this.getDetailProductPaypaymall(slugShop, slugPro);
    return infoPaypaymall;
  }
  async getDetailProductStore(shopId: string, slugPro: string) {
    const url = `https://store.shopping.yahoo.co.jp/${shopId}/${slugPro}.html`;
    const result = await this.requestService.getMethod<string>(encodeURI(url));
    const $ = Cheerio.load(result);
    const name = $('#shpMain > div.gdColumns.gd3ColumnItem > div.gd3ColumnItem2 > div.mdItemName > p.elName').text();
    let price;
    price = parseFloat(
      $(
        '#shpMain > div.gdColumns.gd3ColumnItem > div.gd3ColumnItem2 > div.mdLemItemPrice > div.elMain > div > p.elPriceText > span.elPriceNumber',
      )
        .text()
        .replace(',', ''),
    );
    if (!price) {
      price = parseFloat(
        $('#prcdsp > div:nth-child(1) > div.elColumnRight > p > span.elPriceNumber').text().replace(',', ''),
      );
    }
    const information = $(
      '#shpMain > div.gdColumns.gd3ColumnItem > div.gd3ColumnItem1 > div.mdItemDescription > p',
    ).html();
    const images = [];
    const elementsImage = $('#itmbasic > div.elThumbnail > ul > li > a');
    elementsImage.each(function () {
      const element = Cheerio.load(this);
      images.push(element('img').attr('src'));
    });
    const totalRate = parseInt(
      $('#itmrvw > div > p.elReview > a > span.elReviewCount').text().replace('（', '').replace(',', ''),
    );
    let avgRateStar = parseFloat($('#itmrvw > div > p.elReview > a > span.elReviewValue').text());
    if (!avgRateStar) avgRateStar = 0;
    const shop: any = {};
    shop.name = $('#strinfmj > div.elMain > p > a').text();
    shop.totalRate = parseInt(
      $('#strinfmj > div.elSub > p:nth-child(1) > a > span.elReviewCount').text().replace('（', '').replace(',', ''),
    );
    shop.avgRateStar = parseFloat($('#strinfmj > div.elSub > p:nth-child(1) > a > span.elReviewPoint').text());
    shop.link = $('#strinfmj > div.elMain > p > a').attr('href');
    return {
      name,
      price,
      information,
      totalRate,
      avgRateStar,
      shop,
      images,
      shippingFee: 0,
      isStock: true,
    };
  }
  async getDetailProductPaypaymall(shopId: string, productId: string) {
    const url = `https://paypaymall.yahoo.co.jp/store/${shopId}/item/${productId}/`;
    const result = await this.requestService.getMethod<string>(encodeURI(url));
    const $ = Cheerio.load(result);
    const name = $('#itm_ov > div.ItemName > div > h1').text();
    const price = $('#itm_ov > div.ItemPrice > dl.ItemPrice_item.ItemPrice-selling > dd > p.ItemPrice_price')
      .text()
      .replace(/\D+/g, '');
    const information = $('#itm_inf > div.ItemDescription > p').text();
    const totalRate = $('#over_all > div > p.ItemOverall_text').text().replace(/\D+/g, '');
    const avgRateStar = $('#over_all > button:nth-child(2) > p.ItemOverall_text').text().replace('点', '');
    const shop: any = {};
    shop.name = $('#str_inf > div.ItemStore > div > a > h3').text();
    shop.link = $('#str_inf > div.ItemStore > div > a').attr('href');
    shop.avgRateStar = parseFloat(
      $(
        '#str_inf > div.ItemStore > ul.ItemStore_list > li:nth-child(1) > p.ItemStore_itemBody > span > span.Review_average',
      ).text(),
    );
    shop.totalRate = parseInt(
      $('#str_inf > div.ItemStore > ul.ItemStore_list > li:nth-child(1) > a').text().replace(/\D+/g, ''),
    );
    const images = [];
    const imageElement = $('.ItemThumbnail_item > button ');
    imageElement.each(function () {
      const element = Cheerio.load(this);
      images.push(element('amp-img').attr('src'));
    });
    return {
      name,
      price: parseInt(price),
      information,
      totalRate: parseInt(totalRate),
      avgRateStar: parseFloat(avgRateStar),
      shop,
      images,
      shippingFee: 0,
      isStock: true,
    };
  }
  async getListCategoryInMainPage() {
    return [
      {
        id: 3070,
        name: 'Thế giới golf',
      },
      {
        id: 587,
        name: 'Đồ gia dụng',
      },
      {
        id: 50189,
        name: 'Dụng cụ Bonsai',
      },
      {
        id: 40151,
        name: 'Đồ công nghệ',
      },
      {
        id: 5192,
        name: 'Đồng hồ & Phụ kiện',
      },
      {
        id: 44812,
        name: 'Zippo',
      },
      {
        id: 44106,
        name: 'Phụ kiện xe',
      },
      {
        id: 36861,
        name: 'Thời trang Nam - Nữ',
      },
    ];
  }

  async searchProduct(keyword: string, page: number, minPrice: number, maxPrice: number) {
    const results: any = {};

    let url = `https://shopping.yahoo.co.jp/search?b=${30 * (page - 1) + 1}&view=grid`;
    if (keyword) {
      const urlTranslate = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=vi&tl=ja&dt=t&q=${keyword}`;
      const resJapanese = await this.requestService.postMethod<string>(encodeURI(urlTranslate));
      const keyJapan = JSON.parse(resJapanese)[0][0][0].toString();
      url += `&p=${keyJapan}`;
    }
    if (minPrice != null) {
      url += `&pf=${minPrice}`;
    }
    if (maxPrice != null) {
      url += `&pt=${maxPrice}`;
    }

    const response = await this.requestService.getMethod<string>(encodeURI(url));
    const $ = Cheerio.load(response);
    const listItems = $(`#searchResults${page} > div[data-result-type='items'] > ul > li`);
    results.totalProduct = parseInt(
      $(
        '#shpWrapper > main > div.Column._3RZ4M6_sP6nw > div.Column__center._3MLJRzRderwL > div.WaEFXzO1gxUR._11KpetFzYHvU > div._2EvXo2XYUZfp > p',
      )
        .text()
        .replace(',', '')
        .replace(',', ''),
    );
    results.pageSize = 30;
    results.product = [];

    listItems.each(function () {
      let price: number;
      let slugProduct: string;
      let slugShop: string;
      const element = Cheerio.load(this);
      const checkSale = element('div > div:nth-child(2) > div > p');

      if (checkSale.length === 2) {
        price = parseFloat(
          element('div > div:nth-child(2) > div > p:nth-child(2) > span:first-child').text().replace(',', ''),
        );
      } else if (checkSale.length === 1) {
        price = parseFloat(
          element('div > div:nth-child(2) > div > p:first-child > span:first-child').text().replace(',', ''),
        );
      }

      let image;
      const name = element('div > div:nth-child(2) > p > a > span').text();
      const url = element('div > div:first-child > a').attr('href');
      image = element('div > div:first-child > a > img').attr('src');
      if (!image) {
        const contentNoneScript = element('div > div:first-child > a > span > noscript').text();
        const content = Cheerio.load(contentNoneScript);
        image = content('img').attr('src');
      }

      if (url.includes('https://store.shopping.yahoo.co.jp/')) {
        const arr = url.split('/');
        slugShop = arr[3];
        slugProduct = arr[4].slice(0, arr[4].lastIndexOf('.html'));
      }
      if (url.includes('https://paypaymall.yahoo.co.jp/')) {
        slugShop = url.split('/')[4];
        slugProduct = url.split('/')[6];
      }

      results.product.push({ name, price, image, url, slugShop, slugProduct });
    });

    return results;
  }

  async orderProduct(token: string, orderProductShoppingDto: OrderProductShoppingDto) {
    const url = `${this.baseUrl}/api/order/neworder`;
    try {
      const result = await this.requestService.postMethod(url, {
        body: { ...orderProductShoppingDto },
        headers: {
          authorization: token,
        },
        json: true,
      });
      return result;
    } catch (error) {
      throw new HttpException('Lỗi hệ thống vui lòng liên hệ admin !!!', HttpStatus.BAD_REQUEST);
    }
  }
}
