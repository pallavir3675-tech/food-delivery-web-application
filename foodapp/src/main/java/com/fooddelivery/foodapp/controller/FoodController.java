package com.fooddelivery.foodapp.controller;

import com.fooddelivery.foodapp.model.FoodItem;
import com.fooddelivery.foodapp.service.FoodService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/food")
@CrossOrigin(origins = "*")
public class FoodController {

    @Autowired
    private FoodService foodService;

    @GetMapping
    public List<FoodItem> getAllFood() {
        return foodService.getAllFood();
    }

    @GetMapping("/category/{category}")
    public List<FoodItem> getByCategory(@PathVariable String category) {
        return foodService.getFoodByCategory(category);
    }

    @PostMapping
    public FoodItem addFood(@RequestBody FoodItem food) {
        return foodService.addFood(food);
    }
}
