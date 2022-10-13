/* eslint-disable max-len */
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { RequestService } from 'src/shared/services/request.service';
import Cheerio from 'cheerio';
import { ProductOfCategoryDto } from './dto/product-of-category.dto';
import * as Url from 'url';
import { SearchQueryDto } from './dto/search.dto';
import { OrderProductMercariDto } from './dto/order-product-mercari.dto';
@Injectable()
export class MercariService {
  constructor(private readonly requestService: RequestService) {}
  private readonly baseUrl = 'https://api.kimlongexpress.vn';
  getAllCategoryMain() {
    return [
      {
        title: 'Thời trang nữ',
        category_id: 1,
        image: 'https://cf.shopee.vn/file/b8eae9c93139728ecf7b1daa8a6206c1',
      },
      {
        title: 'Thời trang nam',
        category_id: 2,
        image:
          'https://znews-photo.zingcdn.me/w660/Uploaded/pnbcuhbatgunb/2022_01_28/chinese_new_year_year_of_the_tiger_watches.jpg',
      },
      {
        title: 'Thời trang trẻ em',
        category_id: 3,
        image: 'https://media.shoptretho.com.vn/upload/image/news/20180126/xu-huong-thoi-trang-tre-ena2018.jpg',
      },
      {
        title: 'Nhà của & Đời sống',
        category_id: 4,
        image:
          'https://logistics-solution.com/wp-content/uploads/2021/08/van-chuyen-do-gia-dung-tu-vn-di-cang-bangkok-thailand-bang-duong-bien-an-toan.jpg',
      },
      {
        title: 'Sách, VPP & Giải trí',
        category_id: 5,
        image: 'https://httvina.com/image/data/tin-tuc/phan-loai-van-phong-pham.png',
      },
      {
        title: 'Đồ chơi, Hàng thần tượng',
        category_id: 1328,
        image: 'https://cf.shopee.vn/file/5e7b2dfc9728d2f6f630e8a7ce630a0c',
      },
      {
        title: 'Mỹ phẩm & Làm đẹp',
        category_id: 6,
        image:
          'http://cdn.tgdd.vn/Files/2021/03/16/1335716/top-8-thuong-hieu-my-phaviet-natot-nhat-hien-nay-202103161559257688.jpg',
      },
      {
        title: 'Điện gia dụng & Thiết bị số',
        category_id: 7,
        image: 'https://cdn.nguyenkimmall.com/images/detailed/282/10034139-noi-codien-sharp-5-lit-ksh-d55v-01.jpg',
      },
      {
        title: 'Thể thao & Dã ngoại',
        category_id: 8,
        image:
          'https://hoabancamp.com/wp-content/uploads/2019/08/T%C3%BAi-%C4%91%E1%BB%B1ng-%C4%91%E1%BB%93-d%C3%A3-ngo%E1%BA%A1i-du-l%E1%BB%8Bch-g%E1%BA%A5p-g%E1%BB%8Dn-NatureHike-NH18X027-L_black.jpg',
      },
      {
        title: 'Đồ handmade',
        category_id: 9,
        image: 'https://cuahangnoithat.vn/sites/default/files/tu-van/soi-len.jpg',
      },
      {
        title: 'Vé & thẻ ảnh',
        category_id: 1027,
        image: 'https://cf.shopee.vn/file/f9ef7321551ea167352c87a9435c0e1b',
      },
      {
        title: 'Ô tô & xe máy',
        category_id: 1318,
        image: 'https://media-cdn-v2.laodong.vn/storage/newsportal/2022/3/2/1019277/20210419_01_01_W610_.jpeg',
      },
    ];
  }

  async searchProductByCategoryId(category_id: string, page = 1) {
    const pageSize = 30;
    const listProducts: ProductOfCategoryDto[] = [];
    const url = `https://janbox.com/vi/mercari/m-${category_id}?page=${page}&pageSize=${pageSize}`;
    const response = await this.requestService.getMethod<string>(encodeURI(url));
    const $ = Cheerio.load(response);
    const listItem = $('#page_mercari > div.container > div > div > div > div');
    const urlLast = $('.page-item.page-item__last > a').attr('href');
    console.log('urlLast', urlLast);
    const totalPage = Url.parse(urlLast, true).query.page as string;
    listItem.each(function () {
      const element = Cheerio.load(this);
      const url = element('div > a').attr('href');
      const name = element('div > a > img').attr('alt');
      const image = element('div > a > img').data('image');
      const price = parseInt(
        element('div > div > div > div > div.price_converted.product_price_exchange').attr('data-price-jp'),
      );
      const id = url.replace('https://janbox.com/vi/mercari/item/', '');

      listProducts.push({ name, price, image, url, productId: id });
    });

    return { results: listProducts, totalPage: parseInt(totalPage), pageSize, page };
  }

  async getDetailProduct(pid: string) {
    const url = `https://janbox.com/vi/mercari/item/${pid}`;
    const response = await this.requestService.getMethod<string>(encodeURI(url));
    const $ = Cheerio.load(response);

    const name = $('#page_mercari > div.page_body > div > div.row.mb50 > div.col-5 > h1').text();
    const price = parseInt(
      $(
        '#page_mercari > div.page_body > div > div.row.mb50 > div.col-5 > div.mb30 > div > div.product_detail__box_body > div > div:nth-child(1) > div.product_detail__box_price.mb-3 > strong',
      )
        .text()
        .replace(',', ''),
    );
    const information = $(
      '#page_mercari > div.page_body > div > div.block_container.product_detail__content > div.block_body',
    )
      .text()
      .trim();
    const images = [];
    const listItemImages = $('#swiper-wrapper-8a6db1b62a13640e > div');
    listItemImages.each(function () {
      const element = Cheerio.load(this);
      images.push(element('img').attr('src'));
    });
    const url_mercari = $(
      '#page_mercari > div.page_body > div > div.row.mb50 > div.col-3 > div > div:nth-child(1) > div:nth-child(2) > strong > a',
    ).attr('href');
    const seller: any = {};
    seller.name = $(
      '#page_mercari > div.page_body > div > div.row.mb50 > div.col-3 > div > div:nth-child(2) > div > div.store_info__data > div > h4 > a',
    ).text();
    seller.id = $(
      '#page_mercari > div.page_body > div > div.row.mb50 > div.col-3 > div > div:nth-child(2) > div > div.store_info__data > div > h4 > a',
    )
      .attr('href')
      .replace('/vi/mercari/seller/', '');
    seller.rateGood = $(
      '#page_mercari > div.page_body > div > div.row.mb50 > div.col-3 > div > div:nth-child(2) > div > div.store_info__rating > div > div:nth-child(1) > strong',
    ).text();
    seller.rateNormal = $(
      '#page_mercari > div.page_body > div > div.row.mb50 > div.col-3 > div > div:nth-child(2) > div > div.store_info__rating > div > div:nth-child(2) > strong',
    ).text();
    seller.rateBad = $(
      '#page_mercari > div.page_body > div > div.row.mb50 > div.col-3 > div > div:nth-child(2) > div > div.store_info__rating > div > div:nth-child(3) > strong',
    ).text();
    const detailItems = $(
      '#page_mercari > div.page_body > div > div.row.mb50 > div.col-5 > div.row.mb-3 > div.col-9 > table > tbody > tr',
    );
    const detail: any = {};
    detailItems.each(function () {
      const element = Cheerio.load(this);
      const item = element('td:nth-child(1) > strong').text();
      const valueItem = element('td:nth-child(2)').text();

      if (item.includes('Chi nhánh')) {
        detail.brand = valueItem;
        return;
      }
      if (item.includes('Kích thước')) {
        detail.size = valueItem;
        return;
      }
      if (item.includes('Tình trạng hàng hóa')) {
        detail.status = valueItem;
        return;
      }
      if (item.includes('Thuế')) {
        detail.tax = valueItem;
        return;
      }
      if (item.includes('Phí vận chuyển nội địa')) {
        detail.shipping_fee = valueItem;
        return;
      }
    });

    return {
      name,
      price,
      information,
      detail,
      url: url_mercari,
      shop: seller,
    };
  }

  async searchProduct(search: SearchQueryDto) {
    let urlSearch = `https://janbox.com/vi/mercari/search?keyword=${search.keyword}&page=${search.page}`;
    if (search.minPrice) {
      urlSearch += `&priceMin=${search.minPrice}`;
    }
    if (search.maxPrice) {
      urlSearch += `&priceMax=${search.maxPrice}`;
    }
    console.log('urlSearch', urlSearch);
    const listProducts = [];
    const response = await this.requestService.getMethod<string>(encodeURI(urlSearch));
    const $ = Cheerio.load(response);
    const listItem = $('.page_content > div.row > div.col-md-five.mb30');
    const urlLast = $('.page-item.page-item__last > a').attr('href');
    console.log('urlLast', urlLast);
    const totalPage = Url.parse(urlLast, true).query.page as string;
    listItem.each(function () {
      const element = Cheerio.load(this);
      const url = element('div > a').attr('href');
      const name = element('div > a > img').attr('alt');
      const image = element('div > a > img').attr('src');
      const price = parseInt(
        element('div > div > div > div > div.price_converted.product_price_exchange').attr('data-price-jp'),
      );
      const productId = element('div > div.product_item__price > a').data('id');
      listProducts.push({ name, price, image, url, productId });
    });

    return { results: listProducts, totalPage: parseInt(totalPage), pageSize: listProducts.length, page: search.page };
  }

  async orderProduct(token: string, order: OrderProductMercariDto) {
    const url = `${this.baseUrl}/api/order/neworder`;
    try {
      const result = await this.requestService.postMethod(url, {
        body: { ...order },
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
