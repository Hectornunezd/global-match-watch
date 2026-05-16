
INSERT INTO public.channels (country_code, channel_name, channel_type, channel_url, is_free, affiliate_url, affiliate_partner, sort_order)
SELECT c.code, 'Vix', 'streaming', 'https://vix.com', false,
       'https://example.com/vix?utm_source=matchlivenow', 'vix', 50
FROM public.countries c
WHERE c.code IN ('USA','CAN','MEX','GTM','BLZ','SLV','HND','NIC','CRI','PAN','CUB','DOM','HTI','JAM','TTO','PRI','ARG','BRA','CHL','COL','PER','URY','PRY','BOL','ECU','VEN','GUY','SUR')
  AND NOT EXISTS (
    SELECT 1 FROM public.channels ch
    WHERE ch.country_code = c.code AND (ch.affiliate_partner = 'vix' OR LOWER(ch.channel_name) LIKE '%vix%')
  );
