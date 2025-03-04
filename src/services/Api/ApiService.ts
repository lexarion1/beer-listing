import { Product } from '@interfaces';
import { API_URL } from '@constants';

export class ApiService {
    public static async fetchProducts(): Promise<Product[]> {
        return new Promise((resolve, reject) =>
            // faking longer response time to show loader
            setTimeout(() => {
                fetch(API_URL)
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }

                        return response.json();
                    })
                    .then((data) => data.record)
                    .then(resolve)
                    .catch(reject);
            }, 1000),
        );
    }
}
