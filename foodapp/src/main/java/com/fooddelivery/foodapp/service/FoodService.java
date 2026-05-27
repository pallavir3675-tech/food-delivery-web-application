package com.fooddelivery.foodapp.service;

import com.fooddelivery.foodapp.model.FoodItem;
import com.fooddelivery.foodapp.repository.FoodRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class FoodService {

    @Autowired
    private FoodRepository foodRepository;

    public List<FoodItem> getAllFood() {
        return foodRepository.findAll();
    }

    public List<FoodItem> getFoodByCategory(String category) {
        return foodRepository.findByCategory(category);
    }

    public FoodItem addFood(FoodItem food) {
        return foodRepository.save(food);
    }
}
