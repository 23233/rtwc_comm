// 单位是m e.g: getDistanceOfMetre(39.896775,116.35421264,39.89,116.44004334)
export function getDistanceOfMetre(lat1: number, lng1: number, lat2: number, lng2: number): number {
  let radLat1 = (lat1 * Math.PI) / 180.0;
  let radLat2 = (lat2 * Math.PI) / 180.0;
  let a = radLat1 - radLat2;
  let b = (lng1 * Math.PI) / 180.0 - (lng2 * Math.PI) / 180.0;
  let s =
    2 *
    Math.asin(
      Math.sqrt(
        Math.pow(Math.sin(a / 2), 2) +
          Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2),
      ),
    );
  s = s * 6378.137; // EARTH_RADIUS;
  s = Math.round(s * 1000);
  return s;
}

// 返回更为美观的带单位的距离 e.g: 2.1km 900m
export function getDistance(lat1: number, lng1: number, lat2: number, lng2: number): string {
  if (lat1 === lat2 && lng1 === lng2) {
    return '1m';
  }
  const metre = getDistanceOfMetre(lat1, lng1, lat2, lng2);
  if (isNaN(metre) || metre < 1) {
    return '未知';
  }
  return parseToKm(metre);
}

export function parseToKm(metre: number) {
  const c = Math.round(metre);
  if (c >= 1000) {
    return parseFloat((c / 1000).toFixed(1)) + 'km';
  }
  return c + 'm';
}
