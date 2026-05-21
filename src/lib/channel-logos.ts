// Mapping of affiliate_partner / channel name → official broadcaster domain.
// We resolve the logo via Clearbit's free logo API: https://logo.clearbit.com/<domain>
// Falls back to the channel name initial when nothing matches.

import huluLogo from "@/assets/logos/hulu.jpg";
import peacockLogo from "@/assets/logos/peacock.jpg";
import fubotvLogo from "@/assets/logos/fubotv.jpg";
import telemundoLogo from "@/assets/logos/telemundo.jpg";
import foxSportsLogo from "@/assets/logos/fox-sports.jpg";
import vixLogo from "@/assets/logos/vix.jpg";
import tycSportsLogo from "@/assets/logos/tyc-sports.jpg";
import tvPublicaLogo from "@/assets/logos/tv-publica.jpg";
import directvGoLogo from "@/assets/logos/directv-go.jpg";
import dsportsLogo from "@/assets/logos/dsports.jpg";
import sbsLogo from "@/assets/logos/sbs.jpg";
import optusSportLogo from "@/assets/logos/optus-sport.jpg";
import orfLogo from "@/assets/logos/orf.jpg";
import vrtLogo from "@/assets/logos/vrt.jpg";
import rtbfLogo from "@/assets/logos/rtbf.jpg";
import fifaLogo from "@/assets/logos/fifa.jpg";
import bandLogo from "@/assets/logos/band.jpg";
import sportvLogo from "@/assets/logos/sportv.jpg";
import sporttvPlayLogo from "@/assets/logos/sporttv-play.jpg";
import globoLogo from "@/assets/logos/globo.jpg";
import globoplayLogo from "@/assets/logos/globoplay.jpg";
import daznLogo from "@/assets/logos/dazn.jpg";
import rdsLogo from "@/assets/logos/rds.jpg";
import expressvpnLogo from "@/assets/logos/expressvpn.jpg";
import ctvLogo from "@/assets/logos/ctv.jpg";
import tsnLogo from "@/assets/logos/tsn.jpg";
import winSportsLogo from "@/assets/logos/winsports.jpg";
import rcnLogo from "@/assets/logos/rcn.jpg";
import rcnAppLogo from "@/assets/logos/rcn-app.jpg";
import caracolLogo from "@/assets/logos/caracol.jpg";
import caracolPlayLogo from "@/assets/logos/caracol-play.jpg";
import rtveLogo from "@/assets/logos/rtve.jpg";
import repretelLogo from "@/assets/logos/repretel.jpg";
import tigoSportsLogo from "@/assets/logos/tigo-sports.jpg";
import teleticaLogo from "@/assets/logos/teletica.jpg";
import beinSportsLogo from "@/assets/logos/bein-sports.jpg";
import m6plusLogo from "@/assets/logos/m6plus.jpg";
import hrtLogo from "@/assets/logos/hrt.jpg";
import claroSportsLogo from "@/assets/logos/claro-sports.jpg";
import televicentroLogo from "@/assets/logos/televicentro.jpg";

// Local logo overrides (take priority over Clearbit domain lookup).
const PARTNER_LOCAL_LOGO: Record<string, string> = {
  hulu: huluLogo,
  peacock: peacockLogo,
  fubotv: fubotvLogo,
  telemundo: telemundoLogo,
  fox: foxSportsLogo,
  vix: vixLogo,
  tyc: tycSportsLogo,
  tvpublica: tvPublicaLogo,
  directv: directvGoLogo,
  dsports: dsportsLogo,
  sbs: sbsLogo,
  optus: optusSportLogo,
  orf: orfLogo,
  vrt: vrtLogo,
  rtbf: rtbfLogo,
  fifaplus: fifaLogo,
  band: bandLogo,
  sportv: sportvLogo,
  sporttvplay: sporttvPlayLogo,
  globo: globoLogo,
  globoplay: globoplayLogo,
  dazn: daznLogo,
  rds: rdsLogo,
  expressvpn: expressvpnLogo,
  ctv: ctvLogo,
  tsn: tsnLogo,
  winsports: winSportsLogo,
  rcn: rcnLogo,
  caracol: caracolLogo,
  rtve: rtveLogo,
  repretel: repretelLogo,
  tigo: tigoSportsLogo,
  teletica: teleticaLogo,
  bein: beinSportsLogo,
  m6: m6plusLogo,
  hrt: hrtLogo,
  claro: claroSportsLogo,
  televicentro: televicentroLogo,
};

const NAME_LOCAL_LOGO: Record<string, string> = {
  "Hulu": huluLogo,
  "Hulu + Live TV": huluLogo,
  "Peacock": peacockLogo,
  "fuboTV": fubotvLogo,
  "FuboTV": fubotvLogo,
  "Telemundo": telemundoLogo,
  "Telemundo Deportes": telemundoLogo,
  "FOX Sports": foxSportsLogo,
  "Fox Sports": foxSportsLogo,
  "ViX": vixLogo,
  "Vix": vixLogo,
  "ViX+": vixLogo,
  "TyC Sports": tycSportsLogo,
  "TYC SPORTS": tycSportsLogo,
  "TyC Sports Play": tycSportsLogo,
  "TYC SPORTS PLAY": tycSportsLogo,
  "TV Pública": tvPublicaLogo,
  "TV PÚBLICA": tvPublicaLogo,
  "TV Publica": tvPublicaLogo,
  "DirecTV Go": directvGoLogo,
  "DIRECTV GO": directvGoLogo,
  "DirecTV GO": directvGoLogo,
  "DSports": dsportsLogo,
  "DSPORTS": dsportsLogo,
  "DSports+": dsportsLogo,
  "SBS": sbsLogo,
  "SBS On Demand": sbsLogo,
  "Optus Sport": optusSportLogo,
  "OPTUS SPORT": optusSportLogo,
  "ORF": orfLogo,
  "ORF 1": orfLogo,
  "ORF1": orfLogo,
  "ORF Sport+": orfLogo,
  "VRT": vrtLogo,
  "VRT 1": vrtLogo,
  "VRT MAX": vrtLogo,
  "RTBF": rtbfLogo,
  "RTBF Auvio": rtbfLogo,
  "La Une": rtbfLogo,
  "FIFA+": fifaLogo,
  "FIFA Plus": fifaLogo,
  "FIFA": fifaLogo,
  "Band": bandLogo,
  "BAND": bandLogo,
  "Bandeirantes": bandLogo,
  "SporTV": sportvLogo,
  "SPORTV": sportvLogo,
  "SporTV Play": sporttvPlayLogo,
  "SPORTV PLAY": sporttvPlayLogo,
  "Globo": globoLogo,
  "GLOBO": globoLogo,
  "TV Globo": globoLogo,
  "Globoplay": globoplayLogo,
  "GLOBOPLAY": globoplayLogo,
  "Globo Play": globoplayLogo,
  "DAZN": daznLogo,
  "DAZN Canada": daznLogo,
  "RDS": rdsLogo,
  "RDS2": rdsLogo,
  "ExpressVPN": expressvpnLogo,
  "Express VPN": expressvpnLogo,
  "CTV": ctvLogo,
  "CTV.ca": ctvLogo,
  "TSN": tsnLogo,
  "TSN1": tsnLogo,
  "TSN2": tsnLogo,
  "TSN3": tsnLogo,
  "TSN4": tsnLogo,
  "TSN5": tsnLogo,
  "Win Sports": winSportsLogo,
  "Win Sports+": winSportsLogo,
  "WIN Sports": winSportsLogo,
  "WIN SPORTS": winSportsLogo,
  "RCN": rcnLogo,
  "Canal RCN": rcnLogo,
  "Noticias RCN": rcnLogo,
  "RCN App": rcnAppLogo,
  "RCN Televisión App": rcnAppLogo,
  "RCN Television App": rcnAppLogo,
  "DirecTV Sports": directvGoLogo,
  "DIRECTV Sports": directvGoLogo,
  "RCN Nuestra Tele": rcnAppLogo,
  "Caracol": caracolLogo,
  "Caracol TV": caracolLogo,
  "Caracol Televisión": caracolLogo,
  "Caracol Television": caracolLogo,
  "Caracol Play": caracolPlayLogo,
  "Noticias Caracol": caracolPlayLogo,
  "RTVE": rtveLogo,
  "RTVE Play": rtveLogo,
  "rtve play": rtveLogo,
  "Repretel": repretelLogo,
  "Tigo Sports": tigoSportsLogo,
  "Tigo Sports+": tigoSportsLogo,
  "Teletica": teleticaLogo,
  "beIN Sports": beinSportsLogo,
  "beIN SPORTS": beinSportsLogo,
  "Bein Sports": beinSportsLogo,
  "BeIN Sports": beinSportsLogo,
  "beIN Sports MENA": beinSportsLogo,
  "beIN SPORTS MENA": beinSportsLogo,
  "Bein Sports MENA": beinSportsLogo,
  "M6": m6plusLogo,
  "M6+": m6plusLogo,
  "6play": m6plusLogo,
  "6Play": m6plusLogo,
  "M6 / 6play": m6plusLogo,
  "HRT": hrtLogo,
  "HRT 1": hrtLogo,
  "HRT1": hrtLogo,
  "HRT 2": hrtLogo,
  "HRT2": hrtLogo,
  "HRT HD": hrtLogo,
  "HRTi": hrtLogo,
  "Hrvatska Radiotelevizija": hrtLogo,
};

const PARTNER_DOMAIN: Record<string, string> = {
  // Americas
  azteca: "tvazteca.com",
  caliente: "caliente.mx",
  televisa: "televisa.com",
  tudn: "tudn.com",
  vix: "vix.com",
  telemundo: "telemundo.com",
  fox: "foxsports.com",
  fubotv: "fubo.tv",
  peacock: "peacocktv.com",
  tsn: "tsn.ca",
  rds: "rds.ca",
  ctv: "ctv.ca",
  dazn: "dazn.com",
  hulu: "hulu.com",
  claro: "clarosports.com",
  blim: "blimtv.com",
  fifaplus: "fifa.com",
  teletica: "teletica.com",
  tigo: "tigosports.com",
  tcs: "tcs.com.sv",
  tvn: "tvn-2.com",
  unitel: "unitel.bo",
  band: "band.uol.com.br",
  canal13: "13.cl",
  tvnchile: "tvn.cl",
  winsports: "winsports.co",
  americatv: "americatv.com.pe",
  televen: "televen.com",
  globo: "globo.com",
  sportv: "sportv.globo.com",
  caracol: "caracoltv.com",
  rcn: "canalrcn.com",
  directv: "directv.com",
  dsports: "directvsports.com",
  tyc: "tycsports.com",
  tvpublica: "tvpublica.com.ar",
  // Europe
  bbc: "bbc.co.uk",
  itv: "itv.com",
  tf1: "tf1.fr",
  rai: "rai.it",
  rtve: "rtve.es",
  movistar: "movistarplus.es",
  ard: "ard.de",
  zdf: "zdf.de",
  magenta: "magentatv.de",
  sky: "sky.it",
  // MENA
  bein: "beinsports.com",
  "bein-mena": "beinsports.com",
  ssc: "ssc.sa",
  shahid: "shahid.net",
  // Asia / Oceania
  abema: "abema.tv",
  nhk: "nhk.or.jp",
  kbs: "kbs.co.kr",
  sbs: "sbs.com.au",
  "sbs-kr": "sbs.co.kr",
  optus: "sport.optus.com.au",
  jiocinema: "jiocinema.com",
  sports18: "sports18.com",
  // VPN / betting
  expressvpn: "expressvpn.com",
  nordvpn: "nordvpn.com",
  bet365: "bet365.com",
};

const NAME_DOMAIN: Record<string, string> = {
  "BBC One": "bbc.co.uk",
  "BBC iPlayer": "bbc.co.uk",
  "FOX Sports": "foxsports.com",
  "Sky Sport": "sky.it",
  "Sky Sport NZ": "skysport.co.nz",
  "RAI 1": "rai.it",
  "TRT 1": "trt.net.tr",
  "TRT Spor": "trtspor.com.tr",
  "RTP1": "rtp.pt",
  "SIC": "sic.pt",
  "NOS": "nos.pt",
  "Sport TV": "sporttv.pt",
  "RTÉ": "rte.ie",
  "RTBF": "rtbf.be",
  "VRT": "vrt.be",
  "NPO 1": "npo.nl",
  "SRF": "srf.ch",
  "RTS": "rts.ch",
  "RTS1": "rts.ch",
  "HRT": "hrt.hr",
  "Polsat Sport": "polsatsport.pl",
  "TVP Sport": "sport.tvp.pl",
  "Al Aoula": "snrt.ma",
  "Arryadia": "snrt.ma",
  "On Sport": "onsport.tv",
  "SABC Sport": "sabcsport.com",
  "SuperSport": "supersport.com",
  "Canal 10": "canal10.com.uy",
  "Canal 13": "canal13.cl",
  "Chilevisión": "chilevision.cl",
  "Latina TV": "latina.pe",
  "América TV": "americatv.com.pe",
  "Movistar Deportes": "movistarplus.es",
  "Teleamazonas": "teleamazonas.com",
  "Teledoce": "teledoce.com",
  "Teletica": "teletica.com",
  "Repretel": "repretel.com",
  "Televicentro": "televicentro.hn",
  "Tigo Sports": "tigosports.com",
  "TVN": "tvn.cl",
  "Venevisión": "venevision.com",
  "VTV": "vtv.com.uy",
  "Azteca 7": "tvazteca.com",
  "beIN Sports": "beinsports.com",
  "beIN Sports MENA": "beinsports.com",
};

export function channelLogoUrl(channelName: string, partner?: string | null): string | null {
  const local =
    (partner && PARTNER_LOCAL_LOGO[partner]) ||
    NAME_LOCAL_LOGO[channelName] ||
    null;
  if (local) return local;
  const domain =
    (partner && PARTNER_DOMAIN[partner]) ||
    NAME_DOMAIN[channelName] ||
    null;
  if (!domain) return null;
  return `https://logo.clearbit.com/${domain}`;
}
