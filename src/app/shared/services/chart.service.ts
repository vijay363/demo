import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ChartService {
  private API = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getSales() {
    return this.http.get<any>(`${this.API}/sales`);
  }

  getUsers() {
    return this.http.get<any>(`${this.API}/users`);
  }

  getTraffic() {
    return this.http.get<any>(`${this.API}/traffic`);
  }

  getRevenue() {
    return this.http.get<any>(`${this.API}/revenue`);
  }
}
