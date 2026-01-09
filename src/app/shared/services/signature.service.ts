import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class SignatureService {
  private API = 'http://localhost:3000/signatures';

  constructor(private http: HttpClient) { }

  getAll() {
    return this.http.get<any[]>(this.API);
  }

  getById(id: string) {
    return this.http.get<any>(`${this.API}/${id}`);
  }

  create(signature: string) {
    return this.http.post(this.API, {
      signature,
      createdAt: new Date().toISOString(),
    });
  }

  update(id: string, signature: string) {
    return this.http.put(`${this.API}/${id}`, {
      id,
      signature,
      updatedAt: new Date().toISOString(),
    });
  }
  delete(id: string) {
    return this.http.delete(`${this.API}/${id}`);
  }
}


