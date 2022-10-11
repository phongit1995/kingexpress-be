import { Injectable } from '@nestjs/common';
import { RequestService } from 'src/shared/services/request.service';
import Cheerio from 'cheerio';
import { ProductOfCategoryDto } from './dto/product-of-category.dto';

@Injectable()
export class MercariService {
  constructor(private readonly requestService: RequestService) {}

  getAllCategoryMain() {
    return [
      {
        title: 'Thời trang nữ',
        category_id: 'm-1',
        image: 'https://cf.shopee.vn/file/b8eae9c93139728ecf7b1daa8a6206c1',
      },
      {
        title: 'Thời trang nam',
        category_id: 'm-2',
        image:
          'https://znews-photo.zingcdn.me/w660/Uploaded/pnbcuhbatgunb/2022_01_28/chinese_new_year_year_of_the_tiger_watches.jpg',
      },
      {
        title: 'Thời trang trẻ em',
        category_id: 'm-3',
        image: 'https://media.shoptretho.com.vn/upload/image/news/20180126/xu-huong-thoi-trang-tre-em-nam-2018.jpg',
      },
      {
        title: 'Nhà của & Đời sống',
        category_id: 'm-4',
        image:
          'https://logistics-solution.com/wp-content/uploads/2021/08/van-chuyen-do-gia-dung-tu-vn-di-cang-bangkok-thailand-bang-duong-bien-an-toan.jpg',
      },
      {
        title: 'Sách, VPP & Giải trí',
        category_id: 'm-5',
        image: 'https://httvina.com/image/data/tin-tuc/phan-loai-van-phong-pham.png',
      },
      {
        title: 'Đồ chơi, Hàng thần tượng',
        category_id: 'm-1328',
        image: 'https://cf.shopee.vn/file/5e7b2dfc9728d2f6f630e8a7ce630a0c',
      },
      {
        title: 'Mỹ phẩm & Làm đẹp',
        category_id: 'm-6',
        image:
          'http://cdn.tgdd.vn/Files/2021/03/16/1335716/top-8-thuong-hieu-my-pham-viet-nam-tot-nhat-hien-nay-202103161559257688.jpg',
      },
      {
        title: 'Điện gia dụng & Thiết bị số',
        category_id: 'm-7',
        image: 'https://cdn.nguyenkimmall.com/images/detailed/282/10034139-noi-com-dien-sharp-5-lit-ksh-d55v-01.jpg',
      },
      {
        title: 'Thể thao & Dã ngoại',
        category_id: 'm-8',
        image:
          'https://hoabancamp.com/wp-content/uploads/2019/08/T%C3%BAi-%C4%91%E1%BB%B1ng-%C4%91%E1%BB%93-d%C3%A3-ngo%E1%BA%A1i-du-l%E1%BB%8Bch-g%E1%BA%A5p-g%E1%BB%8Dn-NatureHike-NH18X027-L_black.jpg',
      },
      {
        title: 'Đồ handmade',
        category_id: 'm-9',
        image: 'https://cuahangnoithat.vn/sites/default/files/tu-van/soi-len.jpg',
      },
      {
        title: 'Vé & thẻ ảnh',
        category_id: 'm-1027',
        image: 'https://cf.shopee.vn/file/f9ef7321551ea167352c87a9435c0e1b',
      },
      {
        title: 'Ô tô & xe máy',
        category_id: 'm-1318',
        image: 'https://media-cdn-v2.laodong.vn/storage/newsportal/2022/3/2/1019277/20210419_01_01_W610_.jpeg',
      },
    ];
  }

  async searchProductByCategoryId(category_id: string, page = 1) {
    const listProducts: ProductOfCategoryDto[] = [];
    const url = `https://janbox.com/vi/mercari/${category_id}?page=${page}`;
    const response = await this.requestService.getMethod<string>(encodeURI(url));
    const $ = Cheerio.load(response);
    const listItem = $('#page_mercari > div.container > div > div > div > div');

    listItem.each(function () {
      const element = Cheerio.load(this);
      const url = element('div > a').attr('href');
      const name = element('div > a > img').attr('alt');
      const image = element('div > a > img').attr('src');
      const price = parseInt(
        element('div > div > div > div > div.price_converted.product_price_exchange').attr('data-price-jp'),
      );
      const id = url.replace('https://janbox.com/vi/mercari/item/', '');

      listProducts.push({ id, name, price, image, url });
    });

    return { listProducts, total: 999 };
  }
}
