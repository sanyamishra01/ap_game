const AQI_TOKEN = "YOUR_AQICN_TOKEN"; // put your token here

export async function fetchLiveAQI(): Promise<number | null> {
  try {
    const res = await fetch(
      `https://api.waqi.info/feed/geo:28.5433;77.2067/?token=${AQI_TOKEN}`
    );

    const data = await res.json();

    if (data.status !== "ok") return null;

    return data.data.aqi;
  } catch (err) {
    console.error("AQI fetch failed", err);
    return null;
  }
}
