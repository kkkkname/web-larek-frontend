import { Api } from './base/api';
import { ApiResponse, IApi, IOrder, IOrderResult, IProduct } from '../types';

export class WebAPI extends Api implements IApi {
	readonly cdn: string;
	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn
	}

	getItemList(): Promise<IProduct[]> {
		return this.get('/product').then((data: ApiResponse<IProduct>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image
			})))
	}

	postOrder(orderData: IOrder): Promise<IOrderResult> {
		return this.post('/order', orderData).then((data: IOrderResult) => data)
	}
}