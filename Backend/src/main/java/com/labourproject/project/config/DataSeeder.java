package com.labourproject.project.config;

import com.labourproject.project.dao.ServiceCategoryRepository;
import com.labourproject.project.entity.ServiceCategory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.util.*;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private ServiceCategoryRepository serviceCategoryRepository;

    @Override
    public void run(String... args) throws Exception {

        if (serviceCategoryRepository.count() == 0) {

            List<ServiceCategory> categories = Arrays.asList(

                new ServiceCategory(
                    "Plumbing",
                    "Handles all water, pipe, tap, and drainage issues",
                    "wrench",
                    true
                ),
                new ServiceCategory(
                    "Electrical",
                    "Handles wiring, sockets, lighting, and power issues",
                    "bolt",
                    true
                ),
                new ServiceCategory(
                    "HVAC",
                    "Handles AC, heater, thermostat, and ventilation issues",
                    "fan",
                    true
                ),
                new ServiceCategory(
                    "Carpentry",
                    "Handles furniture, cabinets, doors, and wood repairs",
                    "hammer",
                    true
                ),
                new ServiceCategory(
                    "Painting",
                    "Handles interior and exterior wall painting and touch-ups",
                    "paint-brush",
                    true
                ),
                new ServiceCategory(
                    "Cleaning",
                    "Handles deep cleaning, post-construction, and maintenance",
                    "broom",
                    true
                ),
                new ServiceCategory(
                    "Roofing",
                    "Handles roof tiles, leaks, ceiling patches, and repairs",
                    "home",
                    true
                )
            );

            serviceCategoryRepository.saveAll(categories);

   
            System.out.println(" 7 Service Categories loaded successfully!");

        } else {
            System.out.println(" Service Categories already exist! Skipping seed.");
        }
    }
}