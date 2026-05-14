## Actualizar canales europeos con la lista oficial

Sincronizaré la lista de canales de Europa con los broadcasters oficiales que confirmaste para el Mundial 2026.

### Países a actualizar (ya existentes)

Reemplazo la lista actual de canales por la versión oficial. Cada canal indica si es **gratis** o de **pago**.

| País | Canales nuevos |
|---|---|
| España (ESP) | RTVE Play (gratis) · DAZN (pago, 104 partidos) |
| Francia (FRA) | M6 / 6play (gratis, 54) · beIN Sports (pago) |
| Alemania (DEU) | ARD (gratis) · ZDF (gratis) · MagentaTV (pago, 104) |
| Reino Unido (GBR) | BBC iPlayer (gratis) · ITVX (gratis) |
| Italia (ITA) | RaiPlay (gratis, 35) · DAZN (pago, 104) |
| Portugal (PRT) | RTP Play (gratis) · SIC ao Vivo (gratis) · Sport TV (pago) |
| Países Bajos (NLD) | NOS (gratis) |
| Austria (AUT) | ORF (gratis, 106) |
| Suecia (SWE) | SVT (gratis) · TV4 (pago) |
| Noruega (NOR) | NRK (gratis) · TV2 (pago) |

### Países a crear (no existen aún)

| País | Slug ES / EN | Canales |
|---|---|---|
| Finlandia (FIN) | finlandia / finland | YLE (gratis) |
| Dinamarca (DNK) | dinamarca / denmark | DR (gratis) · TV2 (pago) |
| Eslovenia (SVN) | eslovenia / slovenia | RTV Slovenija (gratis) |

Para los nuevos países: alta en `countries` (con `name_es`, `name_en`, `slug_*`, `flag_emoji`, `language_default = 'en'`, meta tags básicos) + sus canales y mapeo ISO-2 → ISO-3 en `src/lib/geolocation.ts` y nombres en `src/components/WhereToWatch.tsx`.

### Detalles técnicos

1. **Datos** — operación `INSERT/UPDATE` sobre `channels` y `countries` (no es un cambio de schema):
   - `DELETE FROM channels WHERE country_code IN (...)` para los 10 países existentes y luego `INSERT` de los nuevos canales.
   - `INSERT INTO countries` para FIN, DNK, SVN.
   - `INSERT INTO channels` para los nuevos países.
   - Campos por canal: `channel_name`, `channel_type` (`tv` o `streaming`), `is_free`, `sort_order` (gratis primero), `channel_url` cuando se conoce.
2. **Frontend** — añadir FI→FIN, DK→DNK, SI→SVN en `ALPHA2_TO_ALPHA3` (`src/lib/geolocation.ts`) y en `COUNTRY_NAMES` (`src/components/WhereToWatch.tsx`).
3. **No se tocan**: tipos generados, esquema, RLS, ni la lógica de la app.

### Notas / supuestos

- Si un canal no tiene `affiliate_url`, queda con el `channel_url` oficial; el botón seguirá funcionando.
- "World Cup Pass" lo trato como una nota informativa de cobertura, no como canal independiente (no es un broadcaster por país).
- Mantengo el orden: gratis (sort 1-2) → pago (sort 3+).
- Si quieres conservar canales actuales que no están en tu lista (p.ej. Movistar+ en España, Sky Sport en Italia, Viaplay en Noruega/Suecia), avísame y los dejo como tercera opción en lugar de borrarlos.
