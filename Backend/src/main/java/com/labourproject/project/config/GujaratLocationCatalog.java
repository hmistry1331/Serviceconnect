package com.labourproject.project.config;

import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;

public final class GujaratLocationCatalog {

    private static final double EARTH_RADIUS_KM = 6371.0;

    public static final class CityPoint {
        private final String city;
        private final double latitude;
        private final double longitude;

        public CityPoint(String city, double latitude, double longitude) {
            this.city = city;
            this.latitude = latitude;
            this.longitude = longitude;
        }

        public String getCity() {
            return city;
        }

        public double getLatitude() {
            return latitude;
        }

        public double getLongitude() {
            return longitude;
        }
    }

    private static final Map<String, CityPoint> CITY_POINTS;

    static {
        Map<String, CityPoint> points = new LinkedHashMap<>();
        points.put("AHMEDABAD", new CityPoint("Ahmedabad", 23.0225, 72.5714));
        points.put("GANDHINAGAR", new CityPoint("Gandhinagar", 23.2156, 72.6369));
        points.put("SURAT", new CityPoint("Surat", 21.1702, 72.8311));
        points.put("BARODA", new CityPoint("Baroda", 22.3072, 73.1812));
        points.put("VADODARA", new CityPoint("Baroda", 22.3072, 73.1812));
        points.put("BHARUCH", new CityPoint("Bharuch", 21.7051, 72.9959));
        points.put("VALSAD", new CityPoint("Valsad", 20.5992, 72.9342));
        CITY_POINTS = Collections.unmodifiableMap(points);
    }

    private GujaratLocationCatalog() {
    }

    public static CityPoint getCityPoint(String cityName) {
        if (cityName == null || cityName.trim().isEmpty()) {
            throw new IllegalArgumentException("City is required.");
        }

        CityPoint cityPoint = CITY_POINTS.get(cityName.trim().toUpperCase(Locale.ROOT));
        if (cityPoint == null) {
            throw new IllegalArgumentException(
                    "Unsupported city. Allowed cities are Ahmedabad, Gandhinagar, Surat, Baroda, Bharuch, and Valsad.");
        }

        return cityPoint;
    }

    public static boolean isValidCoordinate(Double latitude, Double longitude) {
        return latitude != null && longitude != null
                && latitude >= -90 && latitude <= 90
                && longitude >= -180 && longitude <= 180;
    }

    public static double distanceKm(double lat1, double lon1, double lat2, double lon2) {
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);

        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);

        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return EARTH_RADIUS_KM * c;
    }
}
