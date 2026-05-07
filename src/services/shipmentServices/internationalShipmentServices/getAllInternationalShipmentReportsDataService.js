const API_URL = import.meta.env.VITE_APP_API_URL;

const getAllInternationalShipmentReportsDataService = async (params = {}) => {
  const qp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') qp.set(k, v);
  });
  const url = `${API_URL}/shipment/international/reports/data?${qp.toString()}`;
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Authorization': localStorage.getItem('token'),
      'Accept': 'application/json',
    },
  });
  let data;
  try { data = await res.json(); } catch { throw new Error('Failed to parse server response'); }
  if (!res.ok || !data?.success) {
    throw new Error(data?.message || 'Failed to fetch international reports data');
  }
  return data?.data;
};

export default getAllInternationalShipmentReportsDataService;
