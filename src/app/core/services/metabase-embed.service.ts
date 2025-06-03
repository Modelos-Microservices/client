import { Injectable } from '@angular/core';
import { SignJWT } from 'jose/jwt/sign';
import { importJWK } from 'jose/key/import';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MetabaseEmbedService {

  private readonly METABASE_SITE_URL = `${environment.metabase.siteUrl}`;
  private readonly METABASE_SECRET_KEY = `${environment.metabase.token}`;

  constructor() { }

  async generateMetabaseEmbedUrl() {

  // Construimos la clave secreta en formato JWK para JOSE
  const key = await importJWK({
    kty: 'oct',
    k: btoa(this.METABASE_SECRET_KEY), // base64url encoding
  });

  const payload = {
    resource: { dashboard: 98 },
    params: {},
    exp: Math.floor(Date.now() / 1000) + 10 * 60,
  };

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .sign(key);

  return `${this.METABASE_SITE_URL}/embed/dashboard/${token}#bordered=true&titled=true`;
}
}
