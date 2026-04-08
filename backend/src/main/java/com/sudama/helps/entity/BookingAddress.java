package com.sudama.helps.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class BookingAddress {
    
    @Column(name = "booking_street_address", length = 200)
    private String streetAddress;

    @Column(name = "booking_area", length = 100)
    private String area;

    @Column(name = "booking_city", length = 50)
    private String city;

    @Column(name = "booking_pincode", length = 10)
    private String pincode;

    @Column(name = "booking_latitude")
    private Double latitude;

    @Column(name = "booking_longitude")
    private Double longitude;

    @Column(name = "booking_landmark", length = 200)
    private String landmark;

    // Constructors
    public BookingAddress() {}

    public BookingAddress(String streetAddress, String area, String city, String pincode, 
                          Double latitude, Double longitude, String landmark) {
        this.streetAddress = streetAddress;
        this.area = area;
        this.city = city;
        this.pincode = pincode;
        this.latitude = latitude;
        this.longitude = longitude;
        this.landmark = landmark;
    }

    // Getters and Setters
    public String getStreetAddress() { return streetAddress; }
    public void setStreetAddress(String streetAddress) { this.streetAddress = streetAddress; }
    public String getArea() { return area; }
    public void setArea(String area) { this.area = area; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }
    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }
    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }
    public String getLandmark() { return landmark; }
    public void setLandmark(String landmark) { this.landmark = landmark; }
}
