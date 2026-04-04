package com.labourproject.project.dto.response;

public class ServiceCategoryResponse {

    private int id;
    private String name;
    private String description;
    private String iconName;
    private boolean isActive;

    
    public ServiceCategoryResponse() {}

    public ServiceCategoryResponse(int id, String name,
                                    String description,
                                    String iconName,
                                    boolean isActive) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.iconName = iconName;
        this.isActive = isActive;
    }


    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) {
        this.description = description;
    }

    public String getIconName() { return iconName; }
    public void setIconName(String iconName) { this.iconName = iconName; }

    public boolean isActive() { return isActive; }
    public void setActive(boolean active) { isActive = active; }

    @Override
    public String toString() {
        return "ServiceCategoryResponse{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", iconName='" + iconName + '\'' +
                ", isActive=" + isActive +
                '}';
    }
}