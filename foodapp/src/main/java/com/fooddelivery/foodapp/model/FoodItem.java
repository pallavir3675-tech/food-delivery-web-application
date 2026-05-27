package com.fooddelivery.foodapp.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "food_items")
public class FoodItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String description;
    private double price;
    private String category;
    private String emoji;
}