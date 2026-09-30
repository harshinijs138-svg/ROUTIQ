# ROUTIQ. Intelligent Routes. Better Access.

Smart logistics and accessibility intelligence for the North Eastern Region of India. Demo / simulated data only.

## Run
```
npm install
npm run dev      # http://localhost:5173
npm run build
npm run preview
```
Demo login is prefilled (demo@routiq.demo / demo1234), or use "Continue Demo". No backend needed.

## Notes
- Risk engine: `src/utils/risk.js`. Transparent weighted scoring (rainfall 18%, flood 12%, landslide 20%, traffic 10%, road 10%, accessibility impact 30%). Rule-based, not trained ML.
- Services in `src/services` return Promises over `src/data`, so a real API can replace them later.
- Map tiles come from OpenStreetMap and need an internet connection.
