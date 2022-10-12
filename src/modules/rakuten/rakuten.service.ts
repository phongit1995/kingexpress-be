/* eslint-disable max-len */
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import Cheerio from 'cheerio';
import * as Url from 'url';
import { SearchQueryDto } from './dto/search.dto';
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
        id: 558885,
        name: 'Giày Dép',
      },
      {
        id: 204233,
        name: 'Trang điểm',
      },
      {
        id: 563843,
        name: 'Ti Vi',
      },
      {
        id: 200170,
        name: 'Tập thể hình',
      },
    ];
  }

  async getProductDetail(productId: string) {
    const urlDetail = `https://janbox.com/vi/rakuten/item/${productId}`;
    const { data } = await firstValueFrom<any>(this.httpService.get(urlDetail));
    const $ = Cheerio.load(data);
    const name = $('.product_detail__name').text().trim();
    console.log('name', name);
    const images: string[] = [];
    $('.swiper-wrapper > .swiper-slide.gallery_item_thumb >img ').each(function (index, element) {
      images.push($(element).attr('src'));
    });
    const price = $('div.product_detail__box_body > div > span').data('price-jp');
    const information = $('.product_detail__panel_body.product_detail__panel_info').text().trim();
    const shopName = $('.btn_product_heart').data('seller');
    const url = $('.ezb_link').attr('href');
    return {
      name,
      price: parseInt(price),
      images,
      shippingFee: 0,
      isStock: true,
      information,
      totalRate: 0,
      avgRateStar: 0,
      shop: {
        name: shopName,
        avgRateStar: 0,
        totalRate: 0,
        link: '',
      },
      url,
    };
  }

  async searchProduct(search: SearchQueryDto) {
    const pageSize = 30;
    let urlSearch = `https://janbox.com/vi/rakuten/search?fdquery=${search.keyword}&pageSize=${pageSize}&page=${search.page}`;
    if (search.minPrice) {
      urlSearch += `&fdcurrentMinPrice=${search.minPrice}`;
    }
    if (search.maxPrice) {
      urlSearch += `&fdcurrentMaxPrice=${search.maxPrice}`;
    }
    const { data } = await firstValueFrom<any>(this.httpService.get(urlSearch));
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
      page: search.page,
      totalPage: parseInt(totalPage),
      pageSize,
    };
    return urlSearch;
  }
}
