import { geocodeAddress } from "./src/shared/geocoding.ts";
const demoFacilities = [
  { address: "Chandori village road", city: "Niphad" },
  { address: "Ozar highway", city: "Nashik" },
  { address: "Ahmednagar Road", city: "Kopargaon" },
  { address: "APMC yard", city: "Lasalgaon" },
  { address: "Pimpalgaon Baswant bypass", city: "Pimpalgaon" },
  { address: "Ghoti Road, Igatpuri ghat", city: "Igatpuri" }
];
async function run() {
  for (const f of demoFacilities) {
    const res = await geocodeAddress(f.address, f.city);
    console.log(f.address, "->", res);
  }
}
run();
