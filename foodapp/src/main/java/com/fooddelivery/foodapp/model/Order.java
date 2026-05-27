package com.fooddelivery.foodapp.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "orders")
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerName;
    private String address;
    private String itemsOrdered;
    private double totalAmount;
    private String status;

    private LocalDateTime orderTime;

    @PrePersist
    public void setDefaults() {
        this.orderTime = LocalDateTime.now();
        this.status = "PLACED";
    }
}
