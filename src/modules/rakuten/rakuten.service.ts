import { Injectable } from '@nestjs/common';
import { RequestService } from 'src/shared/services/request.service';

@Injectable()
export class RakutenService {
  constructor(private requestService: RequestService) {}
  async getListProductByCategory(categoryId: string, page = 1) {
    const urlGetCategory = `https://www.rakuten.co.jp/`;
    console.log(urlGetCategory);
    const result = await this.requestService.getMethod<string>(urlGetCategory);
    console.log('result', result);
    return result;
  }
}
